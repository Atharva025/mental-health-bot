import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FiMessageSquare, FiHome, FiMoon, FiSun } from 'react-icons/fi';
import './App.css';
import ChatInterface from './ChatInterface';
import HomePage from './HomePage';

function App() {
  const [nightMode, setNightMode] = useState(false);

  // Check system preference for dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setNightMode(prefersDark);
  }, []);

  return (
    <Router>
      <div className={`min-h-screen ${nightMode ? 'bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-700'}`}>
        {/* Simple Navigation Header */}
        <header className={`${nightMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b px-4 py-3`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center 
                ${nightMode ? 'bg-gradient-to-br from-teal-500 to-cyan-600' : 'bg-gradient-to-br from-teal-400 to-cyan-500'}`}
              >
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <span className="font-medium text-lg bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Serene Mind
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="flex space-x-2">
                <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center
                  ${nightMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
                  <FiHome className="mr-1.5" />
                  Home
                </Link>
                <Link to="/chat" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center
                  ${nightMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
                  <FiMessageSquare className="mr-1.5" />
                  Chat
                </Link>
              </nav>

              <button
                onClick={() => setNightMode(!nightMode)}
                className={`p-2 rounded-full ${nightMode ? 'text-teal-400 hover:bg-slate-700' : 'text-teal-600 hover:bg-slate-100'}`}
                aria-label={nightMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {nightMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Routes */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage nightMode={nightMode} />} />
            <Route path="/chat" element={<ChatInterface nightModeApp={nightMode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;