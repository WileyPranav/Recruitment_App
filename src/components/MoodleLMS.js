import React, { useState } from 'react';
import Layout from './Layout';

const MoodleLMS = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', description: '' });

  const handleInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    setCourses([...courses, { ...newCourse, id: Date.now() }]);
    setNewCourse({ name: '', description: '' });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Moodle LMS Integration</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1">Course Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCourse.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-1">Course Description</label>
              <textarea
                id="description"
                name="description"
                value={newCourse.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              ></textarea>
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Add Course</button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Courses</h2>
          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            <ul className="space-y-4">
              {courses.map((course) => (
                <li key={course.id} className="border p-4 rounded">
                  <h3 className="text-xl font-bold">{course.name}</h3>
                  <p>{course.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MoodleLMS;
