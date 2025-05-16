import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMenu, FiMoon, FiSun, FiHelpCircle, FiShare2, FiDownload, FiHeart } from 'react-icons/fi';
import { MdContentCopy, MdOutlineEmojiEmotions, MdStarBorder, MdStar } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { chatRequest, exportConversation, downloadExport } from './chatbotService';

const ChatInterface = ({ nightModeApp }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Welcome to Serene Mind. I'm here to support your mental wellbeing. How are you feeling today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [nightMode, setNightMode] = useState(nightModeApp !== undefined ? nightModeApp : false);
    const [currentMood, setCurrentMood] = useState(null);
    const [copiedMessageId, setCopiedMessageId] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [favoritedMessages, setFavoritedMessages] = useState([]);
    const messagesEndRef = useRef(null);

    // State data simplified for cleaner UI
    const moodOptions = [
        { id: 1, emoji: "😌", label: "Calm", color: "bg-teal-400/20" },
        { id: 2, emoji: "😊", label: "Happy", color: "bg-amber-400/20" },
        { id: 3, emoji: "😔", label: "Sad", color: "bg-blue-400/20" },
        { id: 4, emoji: "😰", label: "Anxious", color: "bg-purple-400/20" },
        { id: 5, emoji: "😴", label: "Tired", color: "bg-slate-400/20" },
        { id: 6, emoji: "😠", label: "Frustrated", color: "bg-orange-400/20" }
    ];

    const quickResponses = [
        { id: 1, text: "I'm feeling anxious", icon: "🌊" },
        { id: 2, text: "Help me sleep better", icon: "🌙" },
        { id: 3, text: "I need to calm down", icon: "🍃" },
        { id: 4, text: "Negative thoughts", icon: "💭" }
    ];


    const resources = [
        { name: "Crisis Text Line", desc: "Text HOME to 741741", url: "https://www.crisistextline.org/" },
        { name: "NAMI Helpline", desc: "1-800-950-NAMI (6264)", url: "https://www.nami.org/help" }
    ];

    // Auto-scroll to bottom of messages
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Set initial night mode based on system preference
    useEffect(() => {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setNightMode(prefersDark);
    }, []);

    useEffect(() => {
        if (nightModeApp !== undefined) {
            setNightMode(nightModeApp);
        }
    }, [nightModeApp]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Handle mood selection
    const handleMoodSelection = (mood) => {
        setCurrentMood(mood);
        if (!currentMood) {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    text: `Thank you for sharing that you're feeling ${mood.label.toLowerCase()}. How can I support you today?`,
                    sender: 'bot',
                    timestamp: new Date()
                }]);
            }, 500);
        }
        // Close sidebar after selection on mobile
        if (window.innerWidth < 768) {
            setShowSidebar(false);
        }
    };

    // Copy message to clipboard
    const copyToClipboard = (id, text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedMessageId(id);
            setTimeout(() => setCopiedMessageId(null), 2000);
        });
    };

    // Toggle favorite status for a message
    const toggleFavorite = (id) => {
        if (favoritedMessages.includes(id)) {
            setFavoritedMessages(prev => prev.filter(msgId => msgId !== id));
        } else {
            setFavoritedMessages(prev => [...prev, id]);
        }
    };

    // Handle quick response selection
    const handleQuickResponse = (response) => {
        setInputValue(response.text);
    };

    // Export conversation
    const handleExport = (format) => {
        try {
            const exportData = exportConversation(messages, format);
            downloadExport(exportData.content, format);
            setShowExportMenu(false);
        } catch (error) {
            console.error('Error exporting conversation:', error);
        }
    };

    // Send message to chatbot
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Format message history for the service
            const messageHistory = messages.slice(-5).map(msg => ({
                text: msg.text,
                sender: msg.sender,
                timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp
            }));

            // Call chatbot service
            const result = await chatRequest(
                userMessage.text,
                messageHistory,
                currentMood?.label || null
            );

            const botResponse = {
                id: Date.now() + 1,
                text: result.response,
                sender: 'bot',
                timestamp: result.timestamp ? new Date(result.timestamp) : new Date()
            };

            setTimeout(() => {
                setMessages(prev => [...prev, botResponse]);
                setConnectionError(false);
                setIsLoading(false);
            }, 700);

        } catch (error) {
            console.error('Error sending message:', error);
            setConnectionError(true);

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: `I apologize, but I'm having trouble responding right now. Please try again in a moment.`,
                sender: 'bot',
                timestamp: new Date(),
                isError: true
            }]);
            setIsLoading(false);
        }
    };

    // Custom markdown components
    const MarkdownComponents = {
        p: ({ node, ...props }) => <p className="mb-3 text-sm leading-relaxed" {...props} />,
        h1: ({ node, ...props }) => <h1 className={`text-xl font-semibold mb-3 ${nightMode ? 'text-teal-300' : 'text-teal-700'}`} {...props} />,
        h2: ({ node, ...props }) => <h2 className={`text-lg font-semibold mb-2 ${nightMode ? 'text-teal-300' : 'text-teal-600'}`} {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
        blockquote: ({ node, ...props }) => (
            <blockquote className={`border-l-4 ${nightMode ? 'border-teal-500/50 bg-teal-900/20' : 'border-teal-300 bg-teal-50/50'} pl-4 py-1 my-3 italic rounded-sm`} {...props} />
        ),
        a: ({ node, ...props }) => (
            <a className={`${nightMode ? 'text-teal-300 hover:text-teal-200' : 'text-teal-600 hover:text-teal-700'} underline`} target="_blank" rel="noopener noreferrer" {...props} />
        )
    };

    return (
        <div className={`h-screen flex flex-col ${nightMode
            ? 'bg-gradient-to-b from-slate-900 to-marine-950 text-slate-200'
            : 'bg-gradient-to-b from-slate-50 to-teal-50 text-slate-700'}`}>

            {/* Simple Header */}
            <header className={`${nightMode
                ? 'bg-slate-900/80 border-b border-teal-900/30'
                : 'bg-white/90 border-b border-teal-200/70'}
                px-4 h-14 flex items-center justify-between backdrop-blur-sm z-20`}>

                <div className="flex items-center">
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="p-2 mr-2 rounded-full hover:bg-teal-500/10"
                        aria-label="Open resources"
                    >
                        <FiMenu className={`h-5 w-5 ${nightMode ? 'text-teal-400' : 'text-teal-600'}`} />
                    </button>
                    <h1 className="text-lg font-medium bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent font-montserrat">
                        Serene Mind
                    </h1>
                </div>

                <div className="flex items-center space-x-2">
                    {currentMood && (
                        <div className={`hidden md:flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs ${currentMood.color}`}>
                            <span>{currentMood.emoji}</span>
                            <span>{currentMood.label}</span>
                        </div>
                    )}
                    {connectionError && (
                        <div className="mr-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs animate-pulse">
                            Reconnecting...
                        </div>
                    )}
                    <button
                        onClick={() => setNightMode(!nightMode)}
                        className={`p-2 rounded-full ${nightMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'}`}
                        title={nightMode ? "Switch to light mode" : "Switch to night mode"}
                        aria-label={nightMode ? "Switch to light mode" : "Switch to night mode"}
                    >
                        {nightMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className={`p-2 rounded-full ${nightMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'} relative`}
                        aria-label="About Serene Mind"
                    >
                        <FiHelpCircle className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Help Info Dialog */}
                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50"
                            onClick={() => setShowInfo(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className={`${nightMode ? 'bg-slate-800' : 'bg-white'} max-w-md rounded-xl p-6 shadow-xl`}
                                onClick={e => e.stopPropagation()}
                            >
                                <h3 className="text-lg font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent mb-3 font-montserrat">
                                    About Serene Mind
                                </h3>
                                <p className={`text-sm ${nightMode ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                                    Serene Mind provides supportive conversations for your mental wellbeing. While I offer coping strategies and a listening ear, I'm not a replacement for professional mental health care.
                                </p>
                                <p className={`text-sm ${nightMode ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                                    If you're experiencing an emergency, please contact emergency services or a crisis helpline immediately.
                                </p>
                                <div className="border-t border-slate-700/30 pt-4 mt-4">
                                    <h4 className="text-sm font-medium text-teal-500 mb-2">Crisis Resources</h4>
                                    <ul className="space-y-2 text-sm">
                                        {resources.map((resource, idx) => (
                                            <li key={idx}>
                                                <a
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`block p-2 rounded ${nightMode ? 'hover:bg-slate-700/50' : 'hover:bg-teal-50'}`}
                                                >
                                                    <span className="font-medium block">{resource.name}</span>
                                                    <span className={nightMode ? 'text-slate-400' : 'text-slate-500'}>{resource.desc}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <AnimatePresence>
                    {showSidebar && (
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 30 }}
                            className="fixed md:relative inset-y-0 left-0 w-[280px] z-30 md:z-10"
                        >
                            <div className={`h-full ${nightMode
                                ? 'bg-slate-900/95 border-r border-teal-900/30'
                                : 'bg-white/95 border-r border-teal-200/70'} 
                                backdrop-blur-sm shadow-lg overflow-auto`}>

                                <div className="p-4 border-b border-teal-500/20 flex justify-between items-center">
                                    <h2 className="text-base font-medium text-teal-500 font-montserrat">Support Resources</h2>
                                    <button
                                        onClick={() => setShowSidebar(false)}
                                        className="p-1.5 rounded-full hover:bg-teal-500/10"
                                    >
                                        <FiMenu className={`h-5 w-5 ${nightMode ? 'text-teal-400' : 'text-teal-600'}`} />
                                    </button>
                                </div>

                                <div className="p-4">
                                    <p className="text-xs uppercase tracking-wide text-teal-500/80 font-montserrat mb-2">How are you feeling?</p>
                                    <div className="grid grid-cols-3 gap-2 mb-6">
                                        {moodOptions.map(mood => (
                                            <button
                                                key={mood.id}
                                                onClick={() => handleMoodSelection(mood)}
                                                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${currentMood?.id === mood.id
                                                    ? `ring-2 ring-teal-500 ${mood.color} shadow-md scale-105`
                                                    : `${nightMode ? 'hover:bg-slate-800' : 'hover:bg-teal-50'}`
                                                    }`}
                                                aria-label={`Select mood: ${mood.label}`}
                                            >
                                                <span className="text-2xl mb-1">{mood.emoji}</span>
                                                <span className="text-xs">{mood.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {favoritedMessages.length > 0 && (
                                        <>
                                            <p className="text-xs uppercase tracking-wide text-teal-500/80 font-montserrat mb-2 mt-6">Saved Insights</p>
                                            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                                                {messages
                                                    .filter(msg => favoritedMessages.includes(msg.id) && msg.sender === 'bot')
                                                    .map(msg => (
                                                        <div
                                                            key={`fav-${msg.id}`}
                                                            className={`text-xs p-2 rounded-lg ${nightMode
                                                                ? 'bg-teal-900/20 border border-teal-900/30'
                                                                : 'bg-teal-50 border border-teal-100'}`}
                                                        >
                                                            {msg.text.length > 80
                                                                ? `${msg.text.substring(0, 80).replace(/[#*_]/g, '')}...`
                                                                : msg.text.replace(/[#*_]/g, '')}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
                    {/* Messages */}
                    <div className={`flex-1 overflow-y-auto p-4 ${nightMode
                        ? 'bg-gradient-to-b from-slate-900/50 to-marine-950/50'
                        : 'bg-gradient-to-b from-slate-50/50 to-teal-50/50'}`}
                    >
                        <div className="max-w-2xl mx-auto space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl 
                                            ${message.sender === 'bot' ? 'rounded-tl-sm' : 'rounded-tr-sm'} 
                                            p-4 ${message.sender === 'bot'
                                                ? nightMode
                                                    ? 'bg-slate-800/90 border border-teal-900/30 text-slate-200'
                                                    : 'bg-white shadow-sm border border-teal-100/80 text-slate-700'
                                                : nightMode
                                                    ? 'bg-teal-800/90 text-white'
                                                    : 'bg-teal-600 text-white'
                                            } ${message.isError ? 'bg-amber-800/90 text-white' : ''}`}
                                    >
                                        {message.sender === 'bot' ? (
                                            <div className={`prose prose-sm max-w-none ${nightMode ? 'prose-invert' : ''}`}>
                                                <ReactMarkdown
                                                    rehypePlugins={[rehypeSanitize, rehypeRaw]}
                                                    remarkPlugins={[remarkGfm]}
                                                    components={MarkdownComponents}
                                                >
                                                    {message.text}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                                        )}

                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-opacity-10 border-current text-xs">
                                            <span className={message.sender === 'bot'
                                                ? (nightMode ? 'text-slate-400' : 'text-slate-500')
                                                : 'text-teal-100'}
                                            >
                                                {formatTime(message.timestamp)}
                                            </span>

                                            {message.sender === 'bot' && (
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => copyToClipboard(message.id, message.text)}
                                                        className="opacity-70 hover:opacity-100 transition-opacity"
                                                        title="Copy to clipboard"
                                                    >
                                                        {copiedMessageId === message.id ? (
                                                            <span className="text-xs">Copied</span>
                                                        ) : (
                                                            <MdContentCopy className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => toggleFavorite(message.id)}
                                                        className={`transition-opacity ${favoritedMessages.includes(message.id)
                                                            ? 'text-amber-400'
                                                            : 'opacity-70 hover:opacity-100'
                                                            }`}
                                                        title={favoritedMessages.includes(message.id)
                                                            ? "Remove from saved insights"
                                                            : "Save this insight"}
                                                    >
                                                        {favoritedMessages.includes(message.id) ? (
                                                            <MdStar className="h-4 w-4" />
                                                        ) : (
                                                            <MdStarBorder className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading Indicator */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className={`max-w-[85%] rounded-2xl rounded-tl-sm p-4 ${nightMode
                                        ? 'bg-slate-800/90 border border-teal-900/30'
                                        : 'bg-white shadow-sm border border-teal-100/80'}`}
                                    >
                                        <div className="flex items-center">
                                            <div className="dot-typing"></div>
                                            <span className="ml-3 text-xs text-teal-500">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Suggested Prompts - show only initially */}
                    {messages.length < 2 && (
                        <div className={`px-4 py-3 ${nightMode
                            ? 'bg-slate-900/70 border-t border-teal-900/30'
                            : 'bg-white/80 border-t border-teal-100/80'}`}
                        >
                            <div className="max-w-2xl mx-auto">
                                <div className="flex flex-wrap gap-2">
                                    {quickResponses.map((response) => (
                                        <button
                                            key={response.id}
                                            onClick={() => handleQuickResponse(response)}
                                            className={`${nightMode
                                                ? 'bg-slate-800/90 hover:bg-slate-700/80 text-teal-300 border border-teal-900/30'
                                                : 'bg-teal-50 hover:bg-teal-100/80 text-teal-700 border border-teal-100'} 
                                                text-sm rounded-full px-3 py-1.5 transition-colors`}
                                        >
                                            <span className="mr-2">{response.icon}</span>
                                            {response.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className={`p-4 ${nightMode
                        ? 'bg-slate-900/80 border-t border-teal-900/30'
                        : 'bg-white/90 border-t border-teal-100/80'}`}
                    >
                        <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto">
                            <div className={`flex items-center rounded-xl ${nightMode
                                ? 'bg-slate-800/80 border border-teal-900/30'
                                : 'bg-white border border-teal-200/70'} 
                                shadow-sm focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500`}
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Share what's on your mind..."
                                    className={`flex-1 py-3 px-4 bg-transparent rounded-l-xl focus:outline-none font-open-sans text-sm ${nightMode
                                        ? 'text-white placeholder-slate-400'
                                        : 'text-slate-700 placeholder-slate-400'}`}
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className={`p-3 rounded-r-xl transition-colors ${!inputValue.trim() || isLoading
                                        ? nightMode
                                            ? 'text-slate-600 cursor-not-allowed'
                                            : 'text-slate-300 cursor-not-allowed'
                                        : nightMode
                                            ? 'bg-teal-600 hover:bg-teal-500 text-white'
                                            : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
                                >
                                    <FiSend className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mt-2 flex justify-between items-center text-xs">
                                <span className={nightMode ? 'text-slate-500' : 'text-slate-400'}>
                                    Not a substitute for professional care
                                </span>

                                {messages.length > 2 && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowExportMenu(!showExportMenu)}
                                            className={`py-1 px-2 rounded ${nightMode ? 'hover:bg-slate-800' : 'hover:bg-teal-50'} ${nightMode ? 'text-teal-400' : 'text-teal-600'}`}
                                        >
                                            Save conversation
                                        </button>

                                        <AnimatePresence>
                                            {showExportMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 5 }}
                                                    className={`absolute right-0 bottom-8 rounded-lg shadow-lg border ${nightMode
                                                        ? 'bg-slate-800 border-teal-900/30'
                                                        : 'bg-white border-teal-200/70'} p-2 z-20 w-40`}
                                                >
                                                    <button
                                                        onClick={() => handleExport('markdown')}
                                                        className={`flex items-center w-full px-3 py-1.5 rounded text-xs ${nightMode
                                                            ? 'hover:bg-slate-700 text-teal-300'
                                                            : 'hover:bg-teal-50 text-teal-700'}`}
                                                    >
                                                        <FiDownload className="mr-2 h-3.5 w-3.5" />
                                                        Markdown (.md)
                                                    </button>
                                                    <button
                                                        onClick={() => handleExport('txt')}
                                                        className={`flex items-center w-full px-3 py-1.5 rounded text-xs ${nightMode
                                                            ? 'hover:bg-slate-700 text-teal-300'
                                                            : 'hover:bg-teal-50 text-teal-700'}`}
                                                    >
                                                        <FiDownload className="mr-2 h-3.5 w-3.5" />
                                                        Plain text (.txt)
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* CSS Styles */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Open+Sans:wght@400;500&display=swap');

                .font-montserrat {
                    font-family: 'Montserrat', sans-serif;
                }
                
                .font-open-sans {
                    font-family: 'Open Sans', sans-serif;
                }
                
                .marine-950 {
                    background-color: #1a2f3d;
                }
                
                .bg-gradient-radial {
                    background-image: radial-gradient(var(--tw-gradient-stops));
                }
                
                /* Modern typing indicator */
                .dot-typing {
                  position: relative;
                  width: 3px;
                  height: 3px;
                  border-radius: 50%;
                  background-color: #4FBDBA;
                  animation: dot-typing 1.5s infinite linear;
                }
                
                .dot-typing::before,
                .dot-typing::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  width: 3px;
                  height: 3px;
                  border-radius: 50%;
                  background-color: #4FBDBA;
                  animation: dot-typing 1.5s infinite linear;
                }
                
                .dot-typing::before {
                  left: -6px;
                  animation-delay: 0s;
                }
                
                .dot-typing::after {
                  left: 6px;
                  animation-delay: 0.75s;
                }
                
                @keyframes dot-typing {
                  0%, 25%, 100% {
                    transform: translateY(0);
                    opacity: 0.6;
                  }
                  50% {
                    transform: translateY(-4px);
                    opacity: 1;
                  }
                  75% {
                    transform: translateY(0);
                    opacity: 0.6;
                  }
                }
            `}</style>
        </div>
    );
};

export default ChatInterface;