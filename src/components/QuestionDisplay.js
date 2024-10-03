import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Timer from './Timer';

const QuestionDisplay = ({ question, answer, onAnswer, onNext, onPrevious, questionNumber, totalQuestions, timeRemaining, onTimeUp }) => {
  const renderOption = (option) => {
    if (option.startsWith('```') && option.endsWith('```')) {
      const match = option.match(/```(\w+)?\n([\s\S]+)```/);
      if (match) {
        const language = match[1] || 'javascript';
        const code = match[2];
        return (
          <SyntaxHighlighter language={language} style={solarizedlight}>
            {code.trim()}
          </SyntaxHighlighter>
        );
      }
    }
    return option;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Timer initialTime={timeRemaining} onTimeUp={onTimeUp} />
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">Question {questionNumber} of {totalQuestions}</h2>
        <p className="mb-4">{question.text}</p>
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              className={`w-full text-left p-4 rounded shadow hover:bg-gray-100 ${
                answer === option ? 'bg-blue-100' : 'bg-white'
              }`}
            >
              {renderOption(option)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={onPrevious}
          disabled={questionNumber === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {questionNumber === totalQuestions ? 'Review' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default QuestionDisplay;