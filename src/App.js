import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import RecruitmentForm from './components/RecruitmentForm';
import Quiz from './pages/quiz';
import Results from './pages/results';
import ChatComponent from './components/ChatComponent';
import MoodleLMS from './components/MoodleLMS';

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/recruitment" element={<RecruitmentForm />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/chat" element={<ChatComponent />} />
          <Route path="/moodle" element={<MoodleLMS />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
