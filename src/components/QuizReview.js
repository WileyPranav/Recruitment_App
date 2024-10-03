import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const QuizReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (location.state && location.state.questions && location.state.answers) {
      setQuestions(location.state.questions);
      setAnswers(location.state.answers);
    } else {
      // Attempt to retrieve from localStorage
      const storedQuestions = JSON.parse(localStorage.getItem('quiz_questions'));
      const storedAnswers = JSON.parse(localStorage.getItem('quiz_answers'));

      if (storedQuestions && storedAnswers && storedQuestions.length === 25 && storedAnswers.length === 25) {
        setQuestions(storedQuestions);
        setAnswers(storedAnswers);
      } else {
        // Data not found or incomplete, alert and redirect
        alert("Invalid quiz data. Please retake the quiz.");
        navigate('/quiz');
      }
    }
  }, [location.state, navigate]);

  const handleAnswerChange = (index) => {
    navigate(`/quiz/${index}`, { state: { questions, answers } }); // Navigate to specific question for editing
  };

  const handleSubmit = () => {
    const candidateData = JSON.parse(localStorage.getItem('candidateData'));
    const correctAnswers = answers.filter((answer, index) => 
      answer && answer === questions[index]?.correctAnswer
    ).length;

    const quizData = {
      candidateInfo: candidateData,
      questions: questions,
      answers: answers,
      result: {
        score: correctAnswers,
        totalQuestions: 25,
        percentage: (correctAnswers / 25) * 100,
        selected: (correctAnswers / 25) >= 0.75
      }
    };
    
    const { saveData } = require('../backend/dataHandler');
    saveData(`candidate_${candidateData?.name || 'unknown'}_quiz_results`, quizData);
    navigate('/results');
  };

  if (questions.length !== 25 || answers.length !== 25) {
    return <div className="text-center">Loading...</div>; // Or a more user-friendly loading message
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Review Your Answers</h2>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <p className="font-bold">{`Question ${index + 1}: ${question.text}`}</p>
          <p>{`Your answer: ${answers[index] || 'Not answered'}`}</p>
          <button
            onClick={() => handleAnswerChange(index)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Change Answer
          </button>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-500 text-white px-6 py-3 rounded"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizReview;