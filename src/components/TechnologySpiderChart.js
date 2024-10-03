import React from 'react';
import { Radar } from 'react-chartjs-2';

const TechnologySpiderChart = ({ technology, skills }) => {
  const data = {
    labels: Object.keys(skills),
    datasets: [
      {
        label: technology,
        data: Object.values(skills),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scale: {
      ticks: { beginAtZero: true, max: 4 },
    },
  };

  return <Radar data={data} options={options} />;
};

export default TechnologySpiderChart;