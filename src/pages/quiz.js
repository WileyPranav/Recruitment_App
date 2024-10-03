import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionDisplay from '../components/QuestionDisplay';
import { generateQuestions, dummyQuestions } from '../utils/api';
import Layout from '../components/Layout';
const { saveData } = require('../backend/dataHandler');

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false); // {{ Add state to track readiness }}
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const candidateData = JSON.parse(localStorage.getItem('candidateData'));
        if (!candidateData || !candidateData.technology) {
          navigate('/recruitment');
          return;
        }
       // const generatedQuestions =  dummyQuestions();
        const generatedQuestions = await generateQuestions(candidateData.technology, 25); // {{ Ensure 25 questions }}
        setQuestions(generatedQuestions);

        const questionData = {
          candidateName: candidateData.name,
          technology: candidateData.technology,
          questions: generatedQuestions
        };
        await saveData(`candidate_${candidateData.name}_questions`, questionData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setIsLoading(false);
        // {{ Optionally, set an error state here to display an error message }}
      }
    };
    fetchQuestions();
  }, [navigate]);

  const handleStartQuiz = () => {
    setIsReady(true); // {{ Set readiness to true when Start Quiz is clicked }}
  };

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="loader mb-4"></div>
          <div className="h-16 overflow-hidden">
            <div className="animate-scroll">
              <p className="mb-4">Mthree: Empowering talent, driving innovation.</p>
              <p className="mb-4">Join the future of finance technology with Mthree.</p>
              <p className="mb-4">Mthree: Where your career takes flight.</p>
              <p className="mb-4">Transform your potential into performance with Mthree.</p>
              <p className="mb-4">Mthree: Bridging the gap between education and industry.</p>
            </div>
          </div>
        </div>
      ) : !isReady ? ( // {{ If not ready, show Start Quiz button }}
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
      ) : ( // {{ If ready, display the quiz }}
        <QuestionDisplay questions={questions} />
      )}
    </div>
    </Layout>
  );
};

export default Quiz;