import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnalysisChart from './AnalysisChart';
import ErrorBoundary from './ErrorBoundary';
import Layout from './Layout';
const { loadData } = require('../backend/dataHandler');


const ResultPage = () => {
  const [quizResults, setQuizResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      const candidateData = JSON.parse(localStorage.getItem('candidateData'));
      if (!candidateData) {
        navigate('/recruitment');
        return;
      }

      try {
        const { loadData } = require('../backend/dataHandler');
        const results = loadData(`candidate_${candidateData.name}_quiz_results`);
        if (!results) {
          navigate('/quiz');
          return;
        }
        setQuizResults(results);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
        navigate('/quiz');
      }
    };

    fetchResults();
  }, [navigate]);

  if (!quizResults) {
    return <div>Loading results...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const csvContent = `Name,${quizResults.candidateInfo.name}
Technology,${quizResults.candidateInfo.technology}
Correct Answers,${quizResults.result.score}
Incorrect Answers,${quizResults.result.totalQuestions - quizResults.result.score}
Total Questions,${quizResults.result.totalQuestions}
Score Percentage,${quizResults.result.percentage.toFixed(2)}%
Selected,${quizResults.result.selected ? 'Yes' : 'No'}

Questions,Answers,Correct Answers
${quizResults.questions.map((q, i) => `"${q.text}","${quizResults.answers[i].answer}","${q.correctAnswer}"`).join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${quizResults.candidateInfo.name}_quiz_results.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
      {quizResults.result.percentage >= 75 && (
        <div className="bg-green-500 text-white p-2 rounded mb-4 text-center">
          Selected
        </div>
      )}
      <div className="mb-8">
        <p>Candidate Name: {quizResults.candidateInfo?.name || 'N/A'}</p>
        <p>Technology: {quizResults.candidateInfo?.technology || 'N/A'}</p>
        <p>Correct Answers: {quizResults.result?.score || 0}</p>
        <p>Incorrect Answers: {(quizResults.result?.totalQuestions || 0) - (quizResults.result?.score || 0)}</p>
        <p>Total Questions: {quizResults.result?.totalQuestions || 0}</p>
        <p>Score Percentage: {quizResults.result?.percentage?.toFixed(2) || 0}%</p>
      </div>
      <ErrorBoundary fallback={<div>There was an error loading the analysis chart.</div>}>
        <AnalysisChart results={quizResults} />
      </ErrorBoundary>
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Print Results
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Download Data
        </button>
      </div>
    </div>
    </Layout>
  );
};

export default ResultPage;