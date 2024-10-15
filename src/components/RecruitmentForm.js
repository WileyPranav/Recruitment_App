import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuestions } from '../utils/api';

const technologies = ['Java Full Stack', 'Python', 'Dev-Ops', 'SRE', 'AI'];

const RecruitmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    education: '',
    location: '',
    language: '',
    technology: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { saveData } = require('../backend/dataHandler');
    saveData(`candidate_${formData.name}_initial_data`, formData);
    
    try {
      const questions = await generateQuestions(formData.technology);
      localStorage.setItem('candidateData', JSON.stringify(formData));
      localStorage.setItem('quizQuestions', JSON.stringify(questions));
      navigate('/quiz');
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollingLines = [
    "MThree is a global leader in tech recruitment.",
    "We connect top talent with leading financial institutions.",
    "Our training programs prepare you for success in the tech industry.",
    "Join MThree and kickstart your career in technology.",
    "We offer opportunities in Java, Python, DevOps, SRE, and AI.",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="text-center">
          <div className="loader mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-4">Preparing Your Quiz...</h2>
          <div className="h-20 overflow-hidden">
            <div className="animate-scroll">
              {scrollingLines.concat(scrollingLines).map((line, index) => (
                <p key={index} className="my-2">{line}</p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">Candidate Information</h2>
          {['name', 'age', 'education', 'location', 'language'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={field}
                type={field === 'age' ? 'number' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="technology">
              Technology
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="technology"
              name="technology"
              value={formData.technology}
              onChange={handleChange}
              required
            >
              <option value="">Select a technology</option>
              {technologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            Start Quiz
          </button>
        </form>
      )}
    </div>
  );
};

export default RecruitmentForm;
