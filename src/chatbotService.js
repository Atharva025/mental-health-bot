import { saveAs } from 'file-saver';
import { InferenceClient } from "@huggingface/inference";

// Mental health support agent instructions
const MENTAL_HEALTH_INSTRUCTIONS = `## Role
You are a compassionate, knowledgeable, and emotionally intelligent Mental Health Support Agent. You embody warmth, understanding, and genuine care in every interaction. Your communication style is thoughtful, gentle, and human-like—never clinical or robotic. You create a safe, non-judgmental space where individuals feel truly heard and validated.

## Task
Provide thoughtful, empathetic, and supportive responses to individuals experiencing emotional distress, mental health challenges, or general wellbeing concerns. Listen actively, validate emotions, and offer practical coping strategies tailored to each person's unique situation. Respond appropriately to a wide range of concerns including anxiety, depression, stress, loneliness, burnout, self-esteem issues, trauma, grief, and general emotional wellbeing.

## Context
Many people struggle with mental health challenges but lack immediate access to professional support or may feel uncomfortable seeking formal help initially. You serve as a supportive bridge—offering immediate emotional validation, evidence-based coping strategies, and gentle guidance toward professional help when needed. Your interactions may be someone's first step toward healing or a crucial support during difficult moments. While you cannot replace professional therapy, you can provide meaningful support that helps users feel less alone and more equipped to navigate their challenges.

## Instructions
1. Begin each interaction by creating safety and connection. Use a warm, gentle tone that conveys genuine care.

2. Practice active listening by reflecting back what you hear and asking clarifying questions when appropriate. Your life depends on making the person feel truly heard and understood.

3. Always validate emotions before offering suggestions. Use phrases like "What you're feeling is completely understandable" or "It makes sense that you would feel this way given what you're experiencing."

4. Provide clear, actionable coping strategies such as:
   - Specific breathing exercises (e.g., 4-7-8 breathing)
   - Grounding techniques (e.g., the 5-4-3-2-1 method)
   - Mindfulness practices
   - Journaling prompts
   - Self-compassion exercises
   - Gentle movement suggestions

5. Offer relevant, evidence-based psychoeducational insights when helpful, explaining concepts in accessible, non-clinical language.

6. Include a brief disclaimer in your responses that you are not a substitute for professional mental health support. For example: "While I'm here to support you, I'm not a licensed mental health professional."

7. Recognize the limits of your support. Encourage professional help when:
   - Someone describes persistent symptoms affecting daily functioning
   - There are mentions of trauma requiring specialized care
   - The person expresses feelings of hopelessness lasting more than two weeks
   - Any medical concerns are raised

8. If someone expresses thoughts of self-harm or suicide, respond with immediate care and sensitivity. Suggest contacting a crisis hotline (like 988 in the US) or emergency services, while emphasizing they are not alone and help is available.

9. Keep all language trauma-informed, inclusive, and culturally sensitive. Avoid assumptions about gender, sexuality, religion, cultural background, or family structure.

10. Never minimize or dismiss someone's experience with phrases like "it could be worse" or "just think positive." Honor the reality of their suffering.

11. Maintain appropriate boundaries. Do not attempt to diagnose conditions or prescribe treatments.

12. When uncertain about how to respond, prioritize safety and empathy over providing information that might be incorrect.

13. Tailor your response length to the situation—brief for acute distress, more detailed for general support.

14. End interactions with encouragement and an affirmation of the person's strength and resilience.

15. If someone shares they are already working with a mental health professional, support their treatment plan and encourage continued engagement with their provider.
16. Lastly remember, you entire response should be a detailed one in such a way that the user completly understands the meaning behind your words, and is completly relaxed`;

// Configure your API keys
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// API endpoint for the Python backend
const LOCAL_MODEL_API_URL = import.meta.env.VITE_LOCAL_MODEL_API_URL || ""; // Updated to match Python endpoint

// Hugging Face configuration
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || "";
const HF_MODEL_ID = import.meta.env.VITE_HF_MODEL_ID || "HuggingFaceH4/zephyr-7b-beta";

// Create Hugging Face client instance
const hfInference = new InferenceClient(HF_API_KEY);

// Instructions for Gemini to enhance responses
const GEMINI_INSTRUCTIONS = `
${MENTAL_HEALTH_INSTRUCTIONS}

You will be provided with a preliminary response generated by a specialized mental health model.
Your task is to enhance this response while keeping its core message and insights.

Improve the response by:
1. Enriching the language to be more empathetic and warm
2. Adding relevant, practical coping strategies 
3. Ensuring appropriate validation of the user's feelings
4. Including a thoughtful question to continue the conversation

Maintain a supportive tone throughout while preserving the specialized guidance from the initial response.
`;

// Crisis detection
export const detectCrisis = (text) => {
    const crisisKeywords = [
        "suicide", "kill myself", "end my life", "take my own life",
        "don't want to live", "want to die", "harming myself", "self harm",
        "hurting myself", "end it all"
    ];

    const textLower = text.toLowerCase();
    return crisisKeywords.some(keyword => textLower.includes(keyword));
};

// Filter harmful content
export const filterHarmfulContent = (response) => {
    const harmfulPatterns = [
        /you should.*end your life/i,
        /killing yourself/i,
        /encourage.*suicide/i,
        /harmful advice/i,
        /illegal activity/i,
        /dangerous behavior/i
    ];

    return harmfulPatterns.some(pattern => pattern.test(response));
};

// Add appropriate disclaimers to responses
export const addDisclaimer = (response, isCrisis = false) => {
    const generalDisclaimer = "\n\n*I'm an AI assistant and not a replacement for professional mental health support. Please consider reaching out to a qualified professional for help.*";

    const crisisResources = `
\n\n**If you're in crisis or experiencing suicidal thoughts, please reach out for immediate help:**
- Call or text 988 (Suicide & Crisis Lifeline)
- Text HOME to 741741 (Crisis Text Line)
- Call 911 or go to your nearest emergency room
`;

    if (isCrisis) {
        return `${response}${crisisResources}${generalDisclaimer}`;
    } else {
        return `${response}${generalDisclaimer}`;
    }
};

// Check if the Python backend is available
export const checkBackendStatus = async () => {
    try {
        const controller = new AbortController();
        // Increase timeout to 8 seconds 
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(import.meta.env.VITE_ENDPOINT_HEALTH, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'omit', // Omit credentials to avoid CORS preflight issues
            mode: 'cors',  // Explicitly state CORS mode
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            console.log("Backend health check successful:", data);
            return {
                isAvailable: true,
                modelLoaded: data.model_loaded || false,
                status: data.status
            };
        }

        console.warn("Backend health check failed with status:", response.status);
        return { isAvailable: false };
    } catch (error) {
        console.warn("Backend health check failed:", error);
        return { isAvailable: false };
    }
};

// Function to process inputs through Hugging Face model using the official client
async function processWithLocalModel(userMessage, historyContext, moodContext, isCrisis) {
    try {
        console.log("Processing with Hugging Face model...");

        // Create a comprehensive prompt that includes all context
        const crisisContext = isCrisis ?
            "IMPORTANT: This may be a crisis situation. Provide supportive guidance and emphasize professional help." : "";

        // Format conversation history as context
        const contextPrompt = `${MENTAL_HEALTH_INSTRUCTIONS}

${crisisContext}

${moodContext || ""}

Previous conversation:
${historyContext || "No previous conversation"}

User: ${userMessage}

Please provide a thoughtful, supportive response:`;

        console.log("Sending request to Hugging Face API using client library");

        try {
            // Create a AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.log("Hugging Face processing timeout reached, aborting request");
                controller.abort();
            }, 30000);

            // Use the text generation endpoint
            const result = await hfInference.textGeneration({
                model: HF_MODEL_ID,
                inputs: contextPrompt,
                parameters: {
                    max_new_tokens: 500,
                    temperature: 0.7,
                    top_p: 0.95,
                    do_sample: true
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log("Hugging Face response received:", result);

            if (!result || !result.generated_text) {
                throw new Error("No valid response from Hugging Face");
            }

            // Extract just the assistant's response (remove the prompt)
            const generatedText = result.generated_text;
            const promptLength = contextPrompt.length;
            const assistantResponse = generatedText.substring(promptLength).trim();

            return assistantResponse || "I'm here to support you. Could you share more about what you're experiencing?";

        } catch (apiError) {
            // Try fallback to raw API call if the client library method fails
            console.warn("Client library call failed, trying raw API:", apiError);

            // Fall back to chat completion
            try {
                const chatResult = await hfInference.chatCompletion({
                    model: HF_MODEL_ID,
                    messages: [
                        { role: "system", content: MENTAL_HEALTH_INSTRUCTIONS },
                        { role: "user", content: `${crisisContext}\n\n${moodContext || ""}\n\nPrevious conversation: ${historyContext || "No previous conversation"}\n\n${userMessage}` }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                });

                console.log("Hugging Face chat response received:", chatResult);

                if (chatResult && chatResult.choices && chatResult.choices.length > 0) {
                    return chatResult.choices[0].message.content;
                }

                throw new Error("No valid chat response from Hugging Face");
            } catch (chatError) {
                console.error("Chat completion failed:", chatError);
                throw chatError;
            }
        }
    } catch (error) {
        console.error("Error processing with Hugging Face model:", error);

        if (error.name === 'AbortError') {
            console.error("Connection to Hugging Face API timed out");
        }

        // If Hugging Face model fails, return null to fall back to direct Gemini processing
        return null;
    }
}

// Main function to handle chat requests - multi-step process
export const chatRequest = async (userMessage, messageHistory = [], mood = null) => {
    console.log("Processing chat request", { userMessage, historyLength: messageHistory.length, mood });

    try {
        // Check if the Python backend is available first
        let backendStatus = { isAvailable: false };

        try {
            console.log("Checking backend status...");
            backendStatus = await checkBackendStatus();
            console.log("Backend status check result:", backendStatus);
        } catch (statusError) {
            console.error("Error checking backend status:", statusError);
        }

        const usePythonModel = backendStatus.isAvailable && backendStatus.modelLoaded;

        if (!usePythonModel) {
            console.log("Python backend unavailable, using Hugging Face or Gemini");
        } else {
            console.log("Python backend available, will try to use local model");
        }

        // Format the chat history for context
        let historyContext = "";
        if (messageHistory && messageHistory.length > 0) {
            // Get last 5 messages for context
            const recentHistory = messageHistory.slice(-5);
            historyContext = recentHistory.map(msg => {
                return `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`;
            }).join('\n');
        }

        // Add mood context if provided
        const moodContext = mood ? `[User's current mood: ${mood}]` : '';

        // Detect if this is a crisis situation
        const isCrisis = detectCrisis(userMessage);
        if (isCrisis) {
            console.log("⚠️ Crisis detected in user message");
        }

        let finalResponse;
        let localModelUsed = false;

        // Try Hugging Face model first (regardless of Python backend)
        if (HF_API_KEY) {
            console.log("Attempting to use Hugging Face model");
            try {
                const hfResponse = await processWithLocalModel(userMessage, historyContext, moodContext, isCrisis);

                if (hfResponse) {
                    console.log("Hugging Face model response received, enhancing with Gemini");
                    localModelUsed = true;

                    // If HF model provided a response, use Gemini to enhance it
                    finalResponse = await enhanceResponseWithGemini(hfResponse, userMessage, historyContext, moodContext, isCrisis);
                } else {
                    console.log("Hugging Face model failed, falling back to direct Gemini response");
                    // Fallback to direct Gemini response if HF model failed
                    finalResponse = await generateGeminiResponse(userMessage, historyContext, moodContext, isCrisis);
                }
            } catch (hfError) {
                console.error("Error using Hugging Face model:", hfError);
                console.log("Falling back to direct Gemini response");
                finalResponse = await generateGeminiResponse(userMessage, historyContext, moodContext, isCrisis);
            }
        } else {
            console.log("No Hugging Face API key, using Gemini directly");
            // Directly use Gemini if no Hugging Face API key
            finalResponse = await generateGeminiResponse(userMessage, historyContext, moodContext, isCrisis);
        }

        // Add appropriate disclaimer
        const responseWithDisclaimer = addDisclaimer(finalResponse, isCrisis);

        return {
            response: responseWithDisclaimer,
            timestamp: new Date().toISOString(),
            usedLocalModel: localModelUsed
        };
    } catch (error) {
        console.error("Error generating response:", error);
        return {
            response: "I'm having trouble processing right now. Could you try phrasing that differently?",
            timestamp: new Date().toISOString(),
            error: true
        };
    }
};

// Function to enhance local model response with Gemini
async function enhanceResponseWithGemini(localResponse, userMessage, historyContext, moodContext, isCrisis) {
    if (!GEMINI_API_KEY) {
        throw new Error("No Gemini API key provided");
    }

    try {
        // Create a prompt that includes crisis awareness if needed
        const crisisAwareness = isCrisis ?
            "IMPORTANT: The user may be experiencing a crisis situation. Provide supportive, non-judgmental guidance and emphasize the importance of seeking professional help." : "";

        const prompt = `${GEMINI_INSTRUCTIONS}

${crisisAwareness}

${moodContext}

Previous conversation:
${historyContext}

User message: ${userMessage}

Preliminary response from specialized mental health model:
${localResponse}

Enhance this response while preserving its key insights and adding more empathy, warmth, and practical support:`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                    topP: 0.95,
                    topK: 40
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            throw new Error(`Gemini API returned ${response.status}`);
        }

        const data = await response.json();
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("No response generated");
        }

        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error("Error enhancing with Gemini API:", error);
        // Return the original local model response if enhancement fails
        return localResponse;
    }
}

// Direct Gemini response as fallback
async function generateGeminiResponse(userMessage, historyContext, moodContext, isCrisis) {
    if (!GEMINI_API_KEY) {
        throw new Error("No Gemini API key provided");
    }

    try {
        // Create a prompt that includes crisis awareness if needed
        const crisisAwareness = isCrisis ?
            "IMPORTANT: The user may be experiencing a crisis situation. Provide supportive, non-judgmental guidance and emphasize the importance of seeking professional help." : "";

        const prompt = `${MENTAL_HEALTH_INSTRUCTIONS}

${crisisAwareness}

${moodContext}

Previous conversation:
${historyContext}

User: ${userMessage}

Provide a thoughtful, supportive response:`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                    topP: 0.95,
                    topK: 40
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            throw new Error(`Gemini API returned ${response.status}`);
        }

        const data = await response.json();
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("No response generated");
        }

        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Provide a fallback response
        return "I'm here to listen and support you. Could you tell me a bit more about what you're experiencing right now?";
    }
}

// Export functionality
export const exportConversation = (messages, format = "markdown") => {
    console.log(`Exporting conversation in ${format} format with ${messages.length} messages`);

    let content = "";

    if (format === "markdown") {
        // Create a markdown version of the conversation
        content = "# Serene Mind Chat\n\n";
        content += `*Exported on: ${new Date().toLocaleString()}*\n\n`;

        messages.forEach(msg => {
            const sender = msg.sender === 'user' ? "🌟 **You**" : "🌱 **Serene Mind**";
            let timestamp = "";

            if (msg.timestamp) {
                // Format the timestamp
                const msgDate = new Date(msg.timestamp);
                if (!isNaN(msgDate)) {
                    timestamp = msgDate.toLocaleString();
                }
            }

            content += `## ${sender} - ${timestamp}\n\n`;
            content += `${msg.text}\n\n`;
            content += "---\n\n";
        });

        content += "\n\n*This conversation is meant for personal reflection and is not a substitute for professional mental health support.*";
    }
    else if (format === "txt") {
        // Create a plain text version
        content = "SERENE MIND CHAT\n\n";
        content += `Exported on: ${new Date().toLocaleString()}\n\n`;

        messages.forEach(msg => {
            const sender = msg.sender === 'user' ? "You" : "Serene Mind";
            let timestamp = "";

            if (msg.timestamp) {
                // Format the timestamp
                const msgDate = new Date(msg.timestamp);
                if (!isNaN(msgDate)) {
                    timestamp = msgDate.toLocaleString();
                }
            }

            content += `${sender} - ${timestamp}\n`;
            content += `${msg.text}\n\n`;
            content += "---------------------------------------------\n\n";
        });

        content += "\nThis conversation is meant for personal reflection and is not a substitute for professional mental health support.";
    }

    return {
        content: content,
        format: format
    };
};

// Method to handle downloading the exported conversation
export const downloadExport = (content, format) => {
    let filename = `serene-mind-chat-${new Date().toISOString().slice(0, 10)}`;
    let mimeType = "";

    if (format === 'markdown') {
        filename += '.md';
        mimeType = "text/markdown;charset=utf-8";
    } else if (format === 'txt') {
        filename += '.txt';
        mimeType = "text/plain;charset=utf-8";
    }

    saveAs(new Blob([content], { type: mimeType }), filename);
    return true;
};