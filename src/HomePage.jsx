import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiHeart, FiShield, FiBookOpen, FiArrowRight, FiActivity, FiCalendar, FiFilm, FiMusic } from 'react-icons/fi';

const HomePage = ({ nightMode }) => {
    // Features section content
    const features = [
        {
            icon: <FiMessageSquare className="h-6 w-6" />,
            title: "Supportive Conversations",
            description: "Have thoughtful, judgment-free conversations about what's on your mind."
        },
        {
            icon: <FiHeart className="h-6 w-6" />,
            title: "Mental Wellness Tools",
            description: "Access techniques for anxiety relief, mindfulness, and emotional balance."
        },
        {
            icon: <FiShield className="h-6 w-6" />,
            title: "Completely Private",
            description: "Your conversations are confidential and never stored longer than needed."
        },
        {
            icon: <FiBookOpen className="h-6 w-6" />,
            title: "Evidence-Based Approach",
            description: "Guidance based on established mental wellness practices and techniques."
        }
    ];

    // Wellness resources content
    const wellnessResources = [
        {
            icon: <FiActivity className="h-6 w-6" />,
            title: "Breathing Exercises",
            description: "Simple breathing techniques to help manage stress and anxiety in the moment.",
            color: "from-blue-500 to-indigo-500"
        },
        {
            icon: <FiCalendar className="h-6 w-6" />,
            title: "Daily Reflection",
            description: "Guided prompts for daily reflection to track your emotional wellbeing.",
            color: "from-amber-500 to-orange-500"
        },
        {
            icon: <FiMusic className="h-6 w-6" />,
            title: "Calming Sounds",
            description: "Ambient sounds and music to help you relax, focus, or sleep better.",
            color: "from-violet-500 to-purple-500"
        },
        {
            icon: <FiFilm className="h-6 w-6" />,
            title: "Guided Meditations",
            description: "Short guided meditations for different moments in your day.",
            color: "from-emerald-500 to-green-500"
        }
    ];

    return (
        <div className={`min-h-screen ${nightMode
            ? 'bg-gradient-to-b from-slate-900 to-marine-950 text-slate-200'
            : 'bg-gradient-to-b from-slate-50 to-teal-50 text-slate-700'}`}>

            {/* Hero Section */}
            <section className="px-4 sm:px-6 py-20 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 font-montserrat"
                            >
                                <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                                    Find Your Mental Balance
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className={`text-lg md:text-xl mb-8 ${nightMode ? 'text-slate-300' : 'text-slate-600'}`}
                            >
                                Serene Mind provides a supportive space for your mental wellbeing through thoughtful conversation and evidence-based techniques.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                            >
                                <Link to="/chat" className="inline-block">
                                    <button className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center ${nightMode
                                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-600/20'
                                        : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                                        }`}>
                                        <FiMessageSquare className="mr-2" />
                                        Start Talking Now
                                    </button>
                                </Link>

                                <Link to="/about" className="inline-block">
                                    <button className={`px-6 py-3 rounded-lg font-medium ${nightMode
                                        ? 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-800'
                                        : 'bg-white hover:bg-slate-50 text-teal-700 border border-teal-200'
                                        }`}>
                                        Learn More
                                    </button>
                                </Link>
                            </motion.div>
                        </div>

                        <div className="md:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="relative"
                            >
                                <div className="relative">
                                    <div className={`absolute inset-0 rounded-2xl ${nightMode
                                        ? 'bg-gradient-to-br from-teal-800/30 to-cyan-800/30'
                                        : 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20'
                                        } blur-xl -m-4 transform rotate-3`}></div>

                                    <div className={`relative rounded-2xl p-6 overflow-hidden border ${nightMode
                                        ? 'bg-slate-800/80 border-teal-900/30'
                                        : 'bg-white/90 border-teal-200'
                                        }`}>
                                        <div className="flex items-center mb-6">
                                            <div className={`w-10 h-10 rounded-full mr-4 flex items-center justify-center 
                        ${nightMode ? 'bg-gradient-to-br from-teal-500 to-cyan-600' : 'bg-gradient-to-br from-teal-400 to-cyan-500'}`}
                                            >
                                                <span className="text-white text-lg font-bold">S</span>
                                            </div>
                                            <h3 className="text-lg font-medium bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                                                Serene Mind
                                            </h3>
                                        </div>

                                        <div className={`mb-4 rounded-lg p-4 w-4/5 ${nightMode
                                            ? 'bg-slate-700/70 border border-teal-900/30'
                                            : 'bg-teal-50 border border-teal-100/80'
                                            }`}>
                                            <p className={`text-sm ${nightMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                Welcome to Serene Mind. I'm here to support your mental wellbeing. How are you feeling today?
                                            </p>
                                        </div>

                                        <div className={`rounded-lg p-4 ml-auto w-4/5 mb-4 ${nightMode
                                            ? 'bg-teal-800/70'
                                            : 'bg-teal-600'
                                            } text-white`}>
                                            <p className="text-sm">
                                                I've been feeling anxious about work lately.
                                            </p>
                                        </div>

                                        <div className={`rounded-lg p-4 w-4/5 ${nightMode
                                            ? 'bg-slate-700/70 border border-teal-900/30'
                                            : 'bg-teal-50 border border-teal-100/80'
                                            }`}>
                                            <p className={`text-sm ${nightMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                I understand work anxiety can be challenging. Let's explore some calming techniques and discuss what specifically feels overwhelming.
                                            </p>
                                        </div>

                                        <div className={`mt-6 flex items-center rounded-xl ${nightMode
                                            ? 'bg-slate-700/70 border border-teal-900/30'
                                            : 'bg-white border border-teal-200/70'
                                            }`}>
                                            <input
                                                type="text"
                                                placeholder="Share what's on your mind..."
                                                className={`flex-1 py-3 px-4 bg-transparent rounded-l-xl text-sm ${nightMode
                                                    ? 'text-white placeholder-slate-400'
                                                    : 'text-slate-700 placeholder-slate-400'
                                                    }`}
                                                disabled
                                            />
                                            <div className={`p-3 rounded-r-xl ${nightMode
                                                ? 'bg-teal-600 text-white'
                                                : 'bg-teal-500 text-white'
                                                }`}>
                                                <FiArrowRight className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="relative">
                <svg className={`w-full h-24 ${nightMode ? 'fill-slate-800' : 'fill-white'}`} viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,50 C150,100 350,0 500,50 C650,100 800,20 1000,80 C1200,30 1320,70 1440,30 L1440,100 L0,100 Z"></path>
                </svg>
            </div>

            {/* Features Section */}
            <section className={`py-16 px-4 sm:px-6 ${nightMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat">
                            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                                How Serene Mind Supports You
                            </span>
                        </h2>
                        <p className={`max-w-2xl mx-auto ${nightMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Our approach combines thoughtful conversation with evidence-based mental wellness techniques to help you navigate life's challenges.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                                className={`p-6 rounded-xl ${nightMode
                                    ? 'bg-slate-700/70 border border-teal-900/30'
                                    : 'bg-teal-50/50 border border-teal-100'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${nightMode
                                    ? 'bg-teal-800 text-teal-300'
                                    : 'bg-teal-100 text-teal-600'
                                    }`}>
                                    {feature.icon}
                                </div>
                                <h3 className={`text-lg font-semibold mb-2 ${nightMode ? 'text-teal-300' : 'text-teal-700'}`}>
                                    {feature.title}
                                </h3>
                                <p className={nightMode ? 'text-slate-300' : 'text-slate-600'}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mental Health Tips Section - Static Content */}
            <section className={`py-16 px-4 sm:px-6 ${nightMode ? 'bg-slate-900' : 'bg-teal-50'}`}>
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat">
                            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                                Simple Practices for Mental Wellness
                            </span>
                        </h2>
                        <p className={`max-w-2xl mx-auto ${nightMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Small habits can make a big difference in how you feel each day
                        </p>
                    </motion.div>

                    <div className={`p-6 rounded-xl ${nightMode ? 'bg-slate-800 border border-teal-900/30' : 'bg-white border border-teal-100'}`}>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex"
                            >
                                <div className={`flex-shrink-0 h-12 w-12 rounded-full mr-4 flex items-center justify-center ${nightMode ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-100 text-teal-600'}`}>
                                    <span className="text-2xl">🌱</span>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold mb-2 ${nightMode ? 'text-teal-300' : 'text-teal-700'}`}>Start Small</h3>
                                    <p className={nightMode ? 'text-slate-300' : 'text-slate-600'}>
                                        Begin with just 5 minutes of mindfulness daily. Consistency matters more than duration.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex"
                            >
                                <div className={`flex-shrink-0 h-12 w-12 rounded-full mr-4 flex items-center justify-center ${nightMode ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-100 text-teal-600'}`}>
                                    <span className="text-2xl">💤</span>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold mb-2 ${nightMode ? 'text-teal-300' : 'text-teal-700'}`}>Prioritize Sleep</h3>
                                    <p className={nightMode ? 'text-slate-300' : 'text-slate-600'}>
                                        Create a calming bedtime routine and aim for 7-9 hours of quality sleep each night.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex"
                            >
                                <div className={`flex-shrink-0 h-12 w-12 rounded-full mr-4 flex items-center justify-center ${nightMode ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-100 text-teal-600'}`}>
                                    <span className="text-2xl">🧘</span>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold mb-2 ${nightMode ? 'text-teal-300' : 'text-teal-700'}`}>Breathe Deeply</h3>
                                    <p className={nightMode ? 'text-slate-300' : 'text-slate-600'}>
                                        Practice 4-7-8 breathing: inhale for 4 seconds, hold for 7, exhale for 8 to reduce anxiety.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex"
                            >
                                <div className={`flex-shrink-0 h-12 w-12 rounded-full mr-4 flex items-center justify-center ${nightMode ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-100 text-teal-600'}`}>
                                    <span className="text-2xl">📱</span>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold mb-2 ${nightMode ? 'text-teal-300' : 'text-teal-700'}`}>Digital Detox</h3>
                                    <p className={nightMode ? 'text-slate-300' : 'text-slate-600'}>
                                        Take regular breaks from screens and social media to reduce stress and improve focus.
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className={`mt-8 p-4 rounded-lg ${nightMode ? 'bg-teal-900/20' : 'bg-teal-50'} text-center`}
                        >
                            <p className={`font-medium ${nightMode ? 'text-teal-300' : 'text-teal-700'}`}>
                                "Self-care is not self-indulgence, it is self-preservation."
                            </p>
                            <p className={`text-sm mt-1 ${nightMode ? 'text-slate-400' : 'text-slate-500'}`}>— Audre Lorde</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`p-8 rounded-2xl ${nightMode
                            ? 'bg-gradient-to-br from-slate-800 to-marine-950 border border-teal-900/30'
                            : 'bg-gradient-to-br from-white to-teal-50 border border-teal-100'
                            }`}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat">
                            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                                Begin Your Journey Today
                            </span>
                        </h2>
                        <p className={`mb-8 max-w-2xl mx-auto ${nightMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Take the first step toward mental wellbeing. Serene Mind is here to listen, support, and guide you through life's challenges.
                        </p>
                        <Link to="/chat">
                            <button className={`px-8 py-4 rounded-lg font-medium text-lg ${nightMode
                                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-600/20'
                                : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                                }`}>
                                Start Your Conversation
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`px-4 sm:px-6 py-8 ${nightMode ? 'bg-slate-900 border-t border-slate-800' : 'bg-white border-t border-slate-100'}`}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center 
                ${nightMode ? 'bg-gradient-to-br from-teal-500 to-cyan-600' : 'bg-gradient-to-br from-teal-400 to-cyan-500'}`}
                            >
                                <span className="text-white text-lg font-bold">S</span>
                            </div>
                            <span className="font-medium text-lg bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                                Serene Mind
                            </span>
                        </div>

                        <div className="flex space-x-6">
                            <Link to="/about" className={`${nightMode ? 'text-slate-400 hover:text-teal-300' : 'text-slate-500 hover:text-teal-600'}`}>
                                About
                            </Link>
                            <Link to="/resources" className={`${nightMode ? 'text-slate-400 hover:text-teal-300' : 'text-slate-500 hover:text-teal-600'}`}>
                                Resources
                            </Link>
                            <Link to="/privacy" className={`${nightMode ? 'text-slate-400 hover:text-teal-300' : 'text-slate-500 hover:text-teal-600'}`}>
                                Privacy
                            </Link>
                            <Link to="/contact" className={`${nightMode ? 'text-slate-400 hover:text-teal-300' : 'text-slate-500 hover:text-teal-600'}`}>
                                Contact
                            </Link>
                        </div>
                    </div>

                    <div className={`mt-8 pt-6 border-t ${nightMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'} text-center text-sm`}>
                        <p>© {new Date().getFullYear()} Serene Mind. All rights reserved.</p>
                        <p className="mt-2">
                            Serene Mind is not a substitute for professional mental health care.
                            If you're experiencing an emergency, please contact emergency services immediately.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;