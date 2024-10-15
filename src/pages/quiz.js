import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionDisplay from '../components/QuestionDisplay';
import ReviewPage from '../components/ReviewPage';
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

  const fetchQuestions = useCallback(() => {
    const storedQuestions = localStorage.getItem('quizQuestions');
    const candidateData = JSON.parse(localStorage.getItem('candidateData'));
    
    if (!storedQuestions || !candidateData) {
      navigate('/recruitment');
      return;
    }
    
    const parsedQuestions = JSON.parse(storedQuestions);
    
    // Randomly select 25 questions
    const shuffled = parsedQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 25);
    
    // Map each question to a competency
    const questionsWithCompetencies = selected.map(question => ({
      ...question,
      competency: mapQuestionToCompetency(question, candidateData.technology)
    }));
    
    setQuestions(questionsWithCompetencies);
    setAnswers(new Array(questionsWithCompetencies.length).fill(null));
    setIsLoading(false);
  }, [navigate]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const mapQuestionToCompetency = (question, technology) => {
    // This function should be implemented to map each question to a competency
    // based on the question's content and the selected technology
    // For now, we'll use a simple mapping based on keywords
    const competencies = getTechnologyCompetencies(technology);
    const questionText = question.text.toLowerCase();
    
    for (const [competency, keywords] of Object.entries(competencies)) {
      if (keywords.some(keyword => questionText.includes(keyword.toLowerCase()))) {
        return competency;
      }
    }
    return 'General Knowledge';
  };

  const getTechnologyCompetencies = (technology) => {
    switch (technology) {
      case 'Java Full Stack':
        return {
          'Core Java': ['object-oriented', 'inheritance', 'polymorphism', 'encapsulation'],
          'Advanced Java': ['multithreading', 'collections', 'generics', 'lambda'],
          'Spring Framework': ['spring', 'dependency injection', 'aop', 'bean'],
          'RESTful APIs': ['rest', 'api', 'http', 'endpoint'],
          'Database Management': ['sql', 'database', 'query', 'jdbc'],
          'Web Development': ['html', 'css', 'javascript', 'servlet', 'jsp']
        };
      case 'Python':
        return {
          'Core Python': ['data types', 'functions', 'loops', 'comprehensions'],
          'Data Structures': ['list', 'dictionary', 'tuple', 'set'],
          'Web Frameworks': ['django', 'flask', 'fastapi'],
          'Data Analysis': ['pandas', 'numpy', 'data manipulation'],
          'Machine Learning': ['scikit-learn', 'tensorflow', 'keras'],
          'API Development': ['rest', 'api', 'http', 'requests']
        };
      // ... Add similar mappings for other technologies
      default:
        return {
          'General Knowledge': ['programming', 'algorithm', 'data structure'],
          'Problem Solving': ['logic', 'efficiency', 'optimization'],
          'Coding Skills': ['syntax', 'debugging', 'best practices'],
          'System Design': ['architecture', 'scalability', 'performance'],
          'Best Practices': ['clean code', 'testing', 'version control'],
          'Tool Proficiency': ['ide', 'git', 'command line']
        };
    }
  };

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
      },
      competencies: calculateCompetencies(questions, answers)
    };
    saveData(`candidate_${candidateData.name}_quiz_results`, quizData);
    navigate('/results');
  };

  const calculateCompetencies = (questions, answers) => {
    const competencies = {};
    questions.forEach((question, index) => {
      if (!competencies[question.competency]) {
        competencies[question.competency] = { total: 0, correct: 0 };
      }
      competencies[question.competency].total++;
      if (answers[index] === question.correctAnswer) {
        competencies[question.competency].correct++;
      }
    });
    return competencies;
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  // Remove the handleTick function as it's no longer needed

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Are you ready to start the quiz?</h2>
        <p className="mb-4">You will have 30 minutes to complete the quiz once you start.</p>
        <button
          onClick={handleStartQuiz}
          className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition duration-300"
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
