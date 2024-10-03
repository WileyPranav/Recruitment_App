import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import TechnologySpiderChart from './TechnologySpiderChart';
import ErrorBoundary from './ErrorBoundary';
import Layout from './Layout';
const { loadData } = require('../backend/dataHandler');

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultPage = () => {
  const [quizResults, setQuizResults] = useState(null);
  const [showSpiderChart, setShowSpiderChart] = useState(false);
  const [bloomsAnalysis, setBloomsAnalysis] = useState({});
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
        calculateBloomsAnalysis(results);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
        navigate('/quiz');
      }
    };

    fetchResults();
  }, [navigate]);

  const calculateBloomsAnalysis = (results) => {
    const analysis = {
      Remember: { total: 0, correct: 0 },
      Understand: { total: 0, correct: 0 },
      Apply: { total: 0, correct: 0 },
      Analyze: { total: 0, correct: 0 },
      Evaluate: { total: 0, correct: 0 },
      Create: { total: 0, correct: 0 }
    };

    results.questions.forEach((question, index) => {
      const bloomsCategory = question.bloomsCategory || 'Understand'; // Default to 'Understand' if not specified
      analysis[bloomsCategory].total += 1;
      
      // Check if the answer is correct
      if (results.answers[index] && results.answers[index].answer === question.correctAnswer) {
        analysis[bloomsCategory].correct += 1;
      }
    });

    console.log('Blooms Analysis:', analysis);
    setBloomsAnalysis(analysis);
  };

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

  const handleToggleSpiderChart = () => {
    setShowSpiderChart(!showSpiderChart);
  };

  const bloomsChartData = {
    labels: Object.keys(bloomsAnalysis),
    datasets: [
      {
        label: 'Total Questions',
        data: Object.values(bloomsAnalysis).map(category => category.total),
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Light blue
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Correct Answers',
        data: Object.values(bloomsAnalysis).map(category => category.correct),
        backgroundColor: 'rgba(255, 99, 132, 1)', // Pink/Red
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const bloomsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: "Bloom's Taxonomy Analysis",
      },
    },
    scales: {
      x: {
        stacked: false, // Ensure bars are side by side
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
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
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2">Bloom's Taxonomy Analysis</h3>
          <div style={{ height: '300px' }}>
            <Bar data={bloomsChartData} options={bloomsChartOptions} />
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handleToggleSpiderChart}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            {showSpiderChart ? 'Hide' : 'Show'} Competency Chart
          </button>
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
        {showSpiderChart && (
          <ErrorBoundary fallback={<div>There was an error loading the competency chart.</div>}>
            <div style={{ width: '60%', margin: '20px auto 0' }}>
              <TechnologySpiderChart technology={quizResults.candidateInfo.technology} />
            </div>
          </ErrorBoundary>
        )}
      </div>
    </Layout>
  );
};

export default ResultPage;