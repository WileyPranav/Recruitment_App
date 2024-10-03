// src/utils/api.js

// Dummy set of 25 questions for testing purposes
const dummyQuestions = [
  {
    id: 1,
    text: "What is the time complexity of accessing an element in an array?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: "O(1)",
    difficulty: "easy",
    bloomsCategory: "Remember"
  },
  {
    id: 2,
    text: "Which of the following is a JavaScript framework?",
    options: ["React", "Django", "Laravel", "Spring"],
    correctAnswer: "React",
    difficulty: "easy",
    bloomsCategory: "Understand"
  },
  {
    id: 3,
    text: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Creative Style Systems",
      "Colorful Style Sheets"
    ],
    correctAnswer: "Cascading Style Sheets",
    difficulty: "easy",
    bloomsCategory: "Remember"
  },
  {
    id: 4,
    text: "Which keyword is used to declare a variable in Java?",
    options: ["var", "let", "const", "All of the above"],
    correctAnswer: "All of the above",
    difficulty: "easy",
    bloomsCategory: "Understand"
  },
  {
    id: 5,
    text: "What is the capital of Python?",
    options: ["Monty", "Guido", "Pythonia", "Snakeville"],
    correctAnswer: "Guido",
    difficulty: "medium",
    bloomsCategory: "Remember"
  },
  {
    id: 6,
    text: "Which company developed the React library?",
    options: ["Google", "Facebook", "Microsoft", "Apple"],
    correctAnswer: "Facebook",
    difficulty: "easy",
    bloomsCategory: "Understand"
  },
  {
    id: 7,
    text: "What does REST stand for in RESTful APIs?",
    options: [
      "Representational State Transfer",
      "Reverse State Transfer",
      "Representational Service Transfer",
      "Remote State Transfer"
    ],
    correctAnswer: "Representational State Transfer",
    difficulty: "medium",
    bloomsCategory: "Understand"
  },
  {
    id: 8,
    text: "In DevOps, what does CI/CD stand for?",
    options: [
      "Continuous Integration/Continuous Deployment",
      "Constant Improvement/Continuous Deployment",
      "Continuous Integration/Continuous Delivery",
      "Constant Improvement/Continuous Delivery"
    ],
    correctAnswer: "Continuous Integration/Continuous Deployment",
    difficulty: "medium",
    bloomsCategory: "Apply"
  },
  {
    id: 9,
    text: "Which HTTP method is used to update a resource?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctAnswer: "PUT",
    difficulty: "medium",
    bloomsCategory: "Apply"
  },
  {
    id: 10,
    text: "What is the purpose of Docker in DevOps?",
    options: [
      "Version Control",
      "Containerization",
      "Continuous Integration",
      "Monitoring"
    ],
    correctAnswer: "Containerization",
    difficulty: "medium",
    bloomsCategory: "Understand"
  },
  {
    id: 11,
    text: "Which language is primarily used for Android app development?",
    options: ["Swift", "Kotlin", "Ruby", "Go"],
    correctAnswer: "Kotlin",
    difficulty: "medium",
    bloomsCategory: "Apply"
  },
  {
    id: 12,
    text: "What is machine learning primarily concerned with?",
    options: [
      "Developing machine hardware",
      "Creating databases",
      "Enabling machines to learn from data",
      "Designing user interfaces"
    ],
    correctAnswer: "Enabling machines to learn from data",
    difficulty: "hard",
    bloomsCategory: "Analyze"
  },
  {
    id: 13,
    text: "In SRE, what does SLA stand for?",
    options: [
      "Service Level Agreement",
      "System Level Access",
      "Service Logging Automation",
      "System Load Assessment"
    ],
    correctAnswer: "Service Level Agreement",
    difficulty: "medium",
    bloomsCategory: "Understand"
  },
  {
    id: 14,
    text: "Which of the following is not a JavaScript data type?",
    options: ["Undefined", "Number", "Boolean", "Float"],
    correctAnswer: "Float",
    difficulty: "medium",
    bloomsCategory: "Remember"
  },
  {
    id: 15,
    text: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Query Language",
      "Sequential Query Language",
      "None of the above"
    ],
    correctAnswer: "Structured Query Language",
    difficulty: "easy",
    bloomsCategory: "Remember"
  },
  {
    id: 16,
    text: "Which Python library is used for data manipulation and analysis?",
    options: ["NumPy", "Pandas", "Matplotlib", "TensorFlow"],
    correctAnswer: "Pandas",
    difficulty: "medium",
    bloomsCategory: "Apply"
  },
  {
    id: 17,
    text: "What is the main purpose of Kubernetes?",
    options: [
      "Web Development",
      "Container Orchestration",
      "Database Management",
      "Version Control"
    ],
    correctAnswer: "Container Orchestration",
    difficulty: "hard",
    bloomsCategory: "Analyze"
  },
  {
    id: 18,
    text: "Which HTTP status code indicates a successful GET request?",
    options: ["200", "201", "404", "500"],
    correctAnswer: "200",
    difficulty: "easy",
    bloomsCategory: "Remember"
  },
  {
    id: 19,
    text: "In Java, which keyword is used to inherit a class?",
    options: ["implements", "extends", "inherits", "super"],
    correctAnswer: "extends",
    difficulty: "medium",
    bloomsCategory: "Understand"
  },
  {
    id: 20,
    text: "What is the base case in a recursive function?",
    options: [
      "The condition to stop recursion",
      "The first recursive call",
      "The maximum recursion depth",
      "None of the above"
    ],
    correctAnswer: "The condition to stop recursion",
    difficulty: "hard",
    bloomsCategory: "Analyze"
  },
  {
    id: 21,
    text: "Which CSS property controls the text size?",
    options: ["font-style", "font-size", "text-size", "text-style"],
    correctAnswer: "font-size",
    difficulty: "easy",
    bloomsCategory: "Remember"
  },
  {
    id: 22,
    text: "What is the primary function of an API?",
    options: [
      "To style web pages",
      "To manage databases",
      "To allow communication between different software systems",
      "To create user interfaces"
    ],
    correctAnswer: "To allow communication between different software systems",
    difficulty: "medium",
    bloomsCategory: "Understand"
  },
  {
    id: 23,
    text: "In AI, what does NLP stand for?",
    options: [
      "Neural Logical Processing",
      "Natural Language Processing",
      "Non-linear Programming",
      "Network Layer Protocol"
    ],
    correctAnswer: "Natural Language Processing",
    difficulty: "hard",
    bloomsCategory: "Analyze"
  },
  {
    id: 24,
    text: "Which command is used to initialize a new Git repository?",
    options: ["git init", "git start", "git create", "git new"],
    correctAnswer: "git init",
    difficulty: "easy",
    bloomsCategory: "Remember"
  },
  {
    id: 25,
    text: "What is the purpose of load balancing in SRE?",
    options: [
      "To store data",
      "To distribute network or application traffic across multiple servers",
      "To secure the network",
      "To develop applications"
    ],
    correctAnswer: "To distribute network or application traffic across multiple servers",
    difficulty: "medium",
    bloomsCategory: "Apply"
  }
];

// Function to generate questions based on technology (dummy implementation)
const generateQuestions = async (technology) => {
  // In a real scenario, you might filter or customize questions based on the technology
  // For testing, we'll return the dummyQuestions array
  return dummyQuestions;
};

export { generateQuestions };