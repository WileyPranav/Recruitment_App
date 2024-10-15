import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const TechnologySpiderChart = ({ technology, competencies }) => {
  const labels = Object.keys(competencies);
  const data = Object.values(competencies);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: `${technology} Competencies`,
        data: data,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${technology} Competency Chart`,
      },
    },
  };

  return (
    <div className="mt-8" style={{ height: '400px' }}>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default TechnologySpiderChart;
