import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { saveData } = require('../backend/dataHandler');
    saveData(`candidate_${formData.name}_initial_data`, formData);
    localStorage.setItem('candidateData', JSON.stringify(formData));
    navigate('/quiz');
  };

  return (<Layout>    
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary-dark">Candidate Information</h2>
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
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
      >
        Start Quiz
      </button>
    </form>
    </Layout>
  );
};

export default RecruitmentForm;