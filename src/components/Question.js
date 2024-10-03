import React from 'react';

const Question = ({ question, answer, onAnswer, questionNumber }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Question {questionNumber}</h2>
      <p className="mb-4">{question.text}</p>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <label key={index} className="flex items-center">
            <input
              type="radio"
              name={`question-${questionNumber}`}
              value={option}
              checked={answer === option}
              onChange={() => onAnswer(option)}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Question;
