import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Remove the Header import if not used
// import Header from './components/Header'; 
import WelcomePage from './components/WelcomePage';
import RecruitmentForm from './components/RecruitmentForm';
import Quiz from './pages/quiz';
import Results from './pages/results';
import ChatComponent from './components/ChatComponent';
import MoodleLMS from './components/MoodleLMS';
import Layout from './components/Layout';
import QuizReview from './components/QuizReview';
import QuestionDisplay from './components/QuestionDisplay';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/recruitment" element={<RecruitmentForm />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/:index" element={<QuestionDisplay />} />
          <Route path="/quiz-review" element={<QuizReview />} />
          <Route path="/results" element={<Results />} />
          <Route path="/chat" element={<ChatComponent />} />
          <Route path="/moodle" element={<MoodleLMS />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;