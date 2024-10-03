import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Timer from './Timer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QuestionDisplay = ({ questions: propQuestions }) => {
  const navigate = useNavigate();
  const { index } = useParams(); // Get the question index from the route
  const questionIndexFromRoute = parseInt(index, 10);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    isNaN(questionIndexFromRoute) ? 0 : questionIndexFromRoute
  );
  
  const [answers, setAnswers] = useState(() => {
    const storedAnswers = JSON.parse(localStorage.getItem('quiz_answers'));
    return storedAnswers && storedAnswers.length === 25 ? storedAnswers : Array(25).fill(null);
  });

  const [questions, setQuestions] = useState(() => {
    const storedQuestions = JSON.parse(localStorage.getItem('quiz_questions'));
    return storedQuestions && storedQuestions.length === 25 ? storedQuestions : propQuestions;
  });
  
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!questions || questions.length !== 25) {
      setError("Quiz questions are incomplete. Please retake the quiz.");
    }
  }, [questions]);

  useEffect(() => {
    // Scroll to top when question changes
    window.scrollTo(0, 0);
  }, [currentQuestionIndex]);

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAnswers(updatedAnswers);
    // Save answers to localStorage
    localStorage.setItem('quiz_answers', JSON.stringify(updatedAnswers));

    if (currentQuestionIndex < 24) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      navigate(`/quiz/${nextIndex}`, { state: { questions, answers: updatedAnswers } });
    } else if (!updatedAnswers.includes(null)) {
      // Save questions to localStorage
      localStorage.setItem('quiz_questions', JSON.stringify(questions));
      navigate('/quiz-review');
    } else {
      // Show a message that all questions must be answered
      alert("Please answer all questions before proceeding to review.");
    }
  };

  const finishQuiz = () => {
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

  // Ensure currentQuestion is defined
  const currentQuestion = questions[currentQuestionIndex];

  const renderOption = (option) => {
    if (option.startsWith('```') && option.endsWith('```')) { // Detect code snippets
      const match = option.match(/```(\w+)?\n([\s\S]+)```/);
      if (match) {
        const language = match[1] || 'javascript'; // Default to javascript if language not specified
        const code = match[2];
        return (
          <SyntaxHighlighter language={language} style={solarizedlight}>
            {code.trim()}
          </SyntaxHighlighter>
        );
      }
    }
    return option;
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!currentQuestion) { // Handle undefined currentQuestion
    return <div className="text-center">Loading question...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Timer duration={1800} onTimeUp={finishQuiz} /> {/* Start timer when component mounts */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">{currentQuestion.text}</h2>
        <div className="space-y-4">
          {currentQuestion.options && currentQuestion.options.length > 0 ? (
            currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 bg-white rounded shadow hover:bg-gray-100"
              >
                {renderOption(option)}
              </button>
            ))
          ) : (
            <div className="text-red-500">No options available for this question.</div>
          )}
        </div>
        <div className="mt-4 text-gray-600">
          Question {currentQuestionIndex + 1} of 25
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;