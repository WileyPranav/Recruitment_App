import React, { useState } from 'react';
import { generateCourseStructure } from '../utils/courseGenerator';

const CourseCreation = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [technology, setTechnology] = useState('');
  const [courseStructure, setCourseStructure] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const structure = await generateCourseStructure(jobDescription, duration, technology);
    setCourseStructure(structure);
  };

  return (
    <div className="course-creation">
      <h2>Course Creation</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Duration of Training"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <input
          type="text"
          placeholder="Technology"
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
        />
        <button type="submit">Generate Course Structure</button>
      </form>
      {courseStructure && (
        <div className="course-structure">
          <h3>Course Structure</h3>
          {courseStructure.map((week, weekIndex) => (
            <div key={weekIndex} className="week">
              <h4>Week {weekIndex + 1}</h4>
              {week.map((day, dayIndex) => (
                <div key={dayIndex} className="day">
                  <h5>Day {dayIndex + 1}</h5>
                  <p><strong>Topic:</strong> {day.topic}</p>
                  <p><strong>Objective:</strong> {day.objective}</p>
                  <p><strong>Activity:</strong> {day.activity}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseCreation;