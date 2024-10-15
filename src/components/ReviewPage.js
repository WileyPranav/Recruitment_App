import React from 'react';
import Layout from './Layout';
import Timer from './Timer';

const ReviewPage = ({ questions, answers, goToQuestion, handleSubmit, timeRemaining }) => {
  return (
    
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Review Your Answers</h2>
        <Timer initialTime={timeRemaining} onTimeUp={handleSubmit} />
        <div className="grid grid-cols-5 gap-4 mb-4">
          {questions.map((question, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`p-2 rounded ${
                answers[index] ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              Question {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Quiz
        </button>
      </div>
    
  );
};

export default ReviewPage;