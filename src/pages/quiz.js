import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionDisplay from '../components/QuestionDisplay';
import ReviewPage from '../components/ReviewPage';
import { generateQuestions } from '../utils/api';
const { saveData } = require('../backend/dataHandler');

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const candidateData = JSON.parse(localStorage.getItem('candidateData'));
        if (!candidateData || !candidateData.technology) {
          navigate('/recruitment');
          return;
        }
        const generatedQuestions = await generateQuestions(candidateData.technology, 25);
        setQuestions(generatedQuestions);
        setAnswers(new Array(generatedQuestions.length).fill(null));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [navigate]);

  const handleStartQuiz = () => {
    setIsReady(true);
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsReviewing(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleReview = () => {
    setIsReviewing(true);
  };

  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setIsReviewing(false);
  };

  const handleSubmit = () => {
    const candidateData = JSON.parse(localStorage.getItem('candidateData'));
    const quizData = {
      candidateInfo: candidateData,
      questions: questions,
      answers: answers,
      result: {
        score: answers.filter((answer, index) => answer === questions[index].correctAnswer).length,
        totalQuestions: questions.length,
        percentage: (answers.filter((answer, index) => answer === questions[index].correctAnswer).length / questions.length) * 100,
      }
    };
    saveData(`candidate_${candidateData.name}_quiz_results`, quizData);
    navigate('/results');
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  // Remove the handleTick function as it's no longer needed

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Are you ready to start the quiz?</h2>
        <p className="mb-4">You will have 30 minutes to complete the quiz once you start.</p>
        <button
          onClick={handleStartQuiz}
          className="bg-primary text-white px-6 py-3 rounded hover:bg-primary-dark transition duration-300"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <ReviewPage
        questions={questions}
        answers={answers}
        goToQuestion={handleGoToQuestion}
        handleSubmit={handleSubmit}
        timeRemaining={timeRemaining}
      />
    );
  }

  return (
    <QuestionDisplay
      question={questions[currentQuestionIndex]}
      answer={answers[currentQuestionIndex]}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onPrevious={handlePrevious}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={questions.length}
      timeRemaining={timeRemaining}
      onTimeUp={handleTimeUp}
    />
  );
};

export default Quiz;