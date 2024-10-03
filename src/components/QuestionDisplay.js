import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';
const { saveData } = require('../backend/dataHandler');

const QuestionDisplay = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timerStarted, setTimerStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (questions.length > 0 && !timerStarted) {
      setTimerStarted(true);
    }
    moveToNextValidQuestion();
  }, [questions, currentQuestionIndex]);

  const moveToNextValidQuestion = () => {
    let nextIndex = currentQuestionIndex;
    while (nextIndex < questions.length && displayedQuestions.length < 25) {
      if (questions[nextIndex].options && questions[nextIndex].options.length > 0) {
        setCurrentQuestionIndex(nextIndex);
        if (!displayedQuestions.includes(questions[nextIndex])) {
          setDisplayedQuestions([...displayedQuestions, questions[nextIndex]]);
        }
        return;
      }
      nextIndex++;
    }
    if (displayedQuestions.length >= 25 || nextIndex >= questions.length) {
      finishQuiz();
    }
  };

  const handleAnswer = (answer) => {
    setAnswers([...answers, { question: questions[currentQuestionIndex], answer }]);
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  const finishQuiz = () => {
    const candidateData = JSON.parse(localStorage.getItem('candidateData'));
    const correctAnswers = answers.filter((answer, index) => 
      answer && answer.answer === displayedQuestions[index]?.correctAnswer
    ).length;
    const quizData = {
      candidateInfo: candidateData,
      questions: displayedQuestions,
      answers: answers,
      result: {
        score: correctAnswers,
        totalQuestions: displayedQuestions.length,
        percentage: displayedQuestions.length > 0 ? (correctAnswers / displayedQuestions.length) * 100 : 0,
        selected: displayedQuestions.length > 0 ? (correctAnswers / displayedQuestions.length) >= 0.75 : false
      }
    };
    const { saveData } = require('../backend/dataHandler');
    saveData(`candidate_${candidateData?.name || 'unknown'}_quiz_results`, quizData);
    navigate('/results');
  };

  const calculateResult = (finalAnswers) => {
    return {
      score: finalAnswers.length,
      totalQuestions: displayedQuestions.length,
    };
  };

  const handleTimeUp = () => {
    finishQuiz();
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      {timerStarted && <Timer duration={1800} onTimeUp={handleTimeUp} />}
      {currentQuestion && currentQuestion.options && currentQuestion.options.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{currentQuestion.text}</h2>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 bg-white rounded shadow hover:bg-gray-100"
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 text-gray-600">
            Question {displayedQuestions.length} of 25
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;