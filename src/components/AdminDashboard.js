import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Fetch candidates data from an API or local storage
    // For now, we'll use mock data
    const mockCandidates = [
      { id: 1, name: 'John Doe', score: 80 },
      { id: 2, name: 'Jane Smith', score: 95 },
      { id: 3, name: 'Bob Johnson', score: 70 },
    ];
    setCandidates(mockCandidates);
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td>{candidate.id}</td>
              <td>{candidate.name}</td>
              <td>{candidate.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;