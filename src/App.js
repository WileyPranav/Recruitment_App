import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import WelcomePage from './components/WelcomePage';
import RecruitmentForm from './components/RecruitmentForm';
import Quiz from './pages/quiz';
import Results from './pages/results';
import ChatComponent from './components/ChatComponent';
import MoodleLMS from './components/MoodleLMS';

function App() {
  const [user, setUser] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleLogin = (username) => {
    setUser(username);
    setShowLoginPrompt(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      setShowLoginPrompt(true);
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          {showLoginPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <p className="text-xl mb-4">Please log in to access this page.</p>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          <Routes>
            <Route path="/" element={user ? <WelcomePage /> : <Login onLogin={handleLogin} />} />
            <Route path="/recruitment" element={<ProtectedRoute><RecruitmentForm /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatComponent /></ProtectedRoute>} />
            <Route path="/moodle" element={<ProtectedRoute><MoodleLMS /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
