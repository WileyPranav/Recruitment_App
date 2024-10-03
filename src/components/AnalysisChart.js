import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const AnalysisChart = ({ results }) => {
  if (!results || !results.answers || !Array.isArray(results.answers)) {
    return <div>No data available for analysis.</div>;
  }

  const labels = results.questions.map((_, index) => `Q${index + 1}`);
  const data = {
    labels,
    datasets: [
      {
        label: 'Score',
        data: results.answers.map(item => item && item.answer === item.question?.correctAnswer ? 1 : 0),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 1
      }
    }
  };

  return <Radar data={data} options={options} />;
};

export default AnalysisChart;