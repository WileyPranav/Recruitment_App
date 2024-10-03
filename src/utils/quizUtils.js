export const loadQuestions = () => {
  // This is a placeholder. In a real application, you would load questions from an API or local storage
  return [
    {
      text: "What is React?",
      options: ["A JavaScript library", "A programming language", "A database", "An operating system"],
      correctAnswer: "A JavaScript library"
    },
    // ... more questions ...
  ];
};

export const saveAnswers = (answers) => {
  // This is a placeholder. In a real application, you would save answers to an API or local storage
  console.log("Saving answers:", answers);
};
