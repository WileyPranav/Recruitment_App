import React, { useState } from 'react';
import { generateCourseStructure } from '../utils/courseGenerator';

const ContentCreation = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [technology, setTechnology] = useState('');
  const [courseStructure, setCourseStructure] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const generatedStructure = await generateCourseStructure(jobDescription, duration, technology);
      setCourseStructure(generatedStructure);
    } catch (error) {
      console.error('Error generating course structure:', error);
      setError('Failed to generate course structure. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Content Creation</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="jobDescription" className="block mb-2">Job Description</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="duration" className="block mb-2">Duration of Training</label>
          <input
            type="text"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="technology" className="block mb-2">Technology</label>
          <input
            type="text"
            id="technology"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Course Structure'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {courseStructure && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Generated Course Structure</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Course Overview</h3>
            <p className="whitespace-pre-line">{courseStructure.overview}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Learning Outcomes</h3>
            <ul className="list-disc pl-5">
              {courseStructure.learningOutcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Technology Overview</h3>
            <p className="whitespace-pre-line">{courseStructure.technologyOverview}</p>
          </div>

          {courseStructure.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Week {week.weekNumber}</h3>
              {week.days.map((day, dayIndex) => (
                <div key={dayIndex} className="mb-4 bg-gray-100 p-4 rounded">
                  <h4 className="text-lg font-medium">Day {day.dayNumber}</h4>
                  <div className="mb-2">
                    <h5 className="font-medium">Topics:</h5>
                    <ul className="list-disc pl-5">
                      {day.content.topics.map((topic, topicIndex) => (
                        <li key={topicIndex}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-2">
                    <h5 className="font-medium">Learning Objectives:</h5>
                    <ul className="list-disc pl-5">
                      {day.content.objectives.map((objective, objectiveIndex) => (
                        <li key={objectiveIndex}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium">Activities:</h5>
                    <ul className="list-disc pl-5">
                      {day.content.activities.map((activity, activityIndex) => (
                        <li key={activityIndex}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentCreation;