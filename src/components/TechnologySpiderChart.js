import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const TechnologySpiderChart = ({ technology }) => {
  const technologyCompetencies = {
    'Java Full Stack': {
      'Core Java': 3,
      'Advanced Java': 2,
      'Java Spring': 4,
      'Java REST': 3,
      'Architecture': 2,
      'Data Structures': 3,
    },
    'Python': {
      'Core Python': 4,
      'Django': 3,
      'Flask': 2,
      'Data Analysis': 3,
      'Machine Learning': 2,
      'Scripting': 4,
    },
    'Dev-Ops': {
      'CI/CD': 3,
      'Docker': 4,
      'Kubernetes': 2,
      'Monitoring': 3,
      'Infrastructure as Code': 2,
      'Automation': 4,
    },
    'SRE': {
      'System Design': 3,
      'Incident Management': 4,
      'Monitoring & Metrics': 3,
      'Automation': 4,
      'Reliability Engineering': 2,
      'Performance Tuning': 3,
    },
    'AI': {
      'Machine Learning': 4,
      'Deep Learning': 3,
      'NLP': 2,
      'Computer Vision': 3,
      'Data Preprocessing': 4,
      'Model Deployment': 2,
    },
  };

  const competencies = technologyCompetencies[technology] || {};
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
        suggestedMax: 5
      }
    }
  };

  return (
    <div className="mt-8" style={{ height: '360px' }}> {/* Increased height by 20% */}
      <h3 className="text-xl font-bold mb-4">Technology Competency Chart</h3>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default TechnologySpiderChart;