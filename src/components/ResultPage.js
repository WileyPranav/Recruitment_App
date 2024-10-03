import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnalysisChart from './AnalysisChart'; // Blooms Taxonomy Chart
import TechnologySpiderChart from './TechnologySpiderChart';
import ErrorBoundary from './ErrorBoundary';
import { loadData } from '../backend/dataHandler';

const ResultPage = () => {
  const [quizResults, setQuizResults] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      const candidateData = JSON.parse(localStorage.getItem('candidateData'));
      if (!candidateData) {
        navigate('/recruitment');
        return;
      }

      try {
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

  const technologySkills = {
    'Java Full Stack': {
      'Core Java': 3,
      'Advanced Java': 2,
      'Java Spring': 4,
      'Java REST': 3,
      'Architecture': 2,
      'Data Structures': 3,
    },
    // Add other technologies and their respective skills here
  };

  const handleAdvancedAnalysis = () => {
    setShowAdvanced(!showAdvanced);
  };

  const candidateName = quizResults.candidateInfo?.name || 'N/A';
  const technology = quizResults.candidateInfo?.technology || 'N/A';
  const score = quizResults.result?.score ?? 0;
  const totalQuestions = quizResults.result?.totalQuestions ?? 0;
  const percentage = quizResults.result?.percentage?.toFixed(2) ?? '0';

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
      {percentage >= 75 && (
        <div className="bg-green-500 text-white p-2 rounded mb-4 text-center">
          Selected
        </div>
      )}
      <div className="mb-8">
        <p>Candidate Name: {candidateName}</p>
        <p>Technology: {technology}</p>
        <p>Correct Answers: {score}</p>
        <p>Incorrect Answers: {totalQuestions - score}</p>
        <p>Total Questions: {totalQuestions}</p>
        <p>Score Percentage: {percentage}%</p>
      </div>
      <ErrorBoundary fallback={<div>There was an error loading the analysis chart.</div>}>
        <AnalysisChart results={quizResults} />
      </ErrorBoundary>
      <button
        onClick={handleAdvancedAnalysis}
        className="mt-4 bg-purple-500 hover:bg-purple-700 text-white px-6 py-2 rounded"
      >
        {showAdvanced ? 'Hide Advanced Analysis' : 'Show Advanced Analysis'}
      </button>
      {showAdvanced && technology && technologySkills[technology] && (
        <ErrorBoundary fallback={<div>There was an error loading the technology spider chart.</div>}>
          <TechnologySpiderChart
            technology={technology}
            skills={technologySkills[technology]}
          />
        </ErrorBoundary>
      )}
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
  );
};

export default ResultPage;