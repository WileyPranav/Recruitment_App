import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const technologyCompetencies = {
  'Java Full Stack': [
    'Core Java',
    'Advanced Java',
    'Spring Framework',
    'RESTful APIs',
    'Database Management',
    'Web Development'
  ],
  'Python': [
    'Core Python',
    'Data Structures',
    'Web Frameworks',
    'Data Analysis',
    'Machine Learning',
    'API Development'
  ],
  'Dev-Ops': [
    'CI/CD',
    'Containerization',
    'Cloud Platforms',
    'Infrastructure as Code',
    'Monitoring and Logging',
    'Security'
  ],
  'SRE': [
    'System Design',
    'Reliability Engineering',
    'Performance Optimization',
    'Incident Management',
    'Automation',
    'Capacity Planning'
  ],
  'AI': [
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Data Preprocessing',
    'Model Deployment'
  ]
};

export const generateQuestions = async (technology) => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key is not set. Please check your .env file.');
    throw new Error('OpenAI API key is not set');
  }

  const competencies = technologyCompetencies[technology] || [
    'General Knowledge',
    'Problem Solving',
    'Coding Skills',
    'System Design',
    'Best Practices',
    'Tool Proficiency'
  ];

  const prompt = `Generate 30 multiple-choice questions for a ${technology} interview. Focus on the core technology. 
  The questions should increase in difficulty and be divided into Bloom's Taxonomy categories: 
  Remember, Understand, Apply, Analyze, and Create. Make sure all the questions that you give have 4 options. Include relevant coding & debugging questions in this. 
  If the question is related to coding then have 4 sample codes to select from, and these 4 options should have a correct solution as well.

  Make the questions scenario-based rather than having direct answers. like Comprehension, Application, Analysis, Evaluation, and Creation.

  For each question, assign one of the following competencies:
  ${competencies.join(', ')}

  Format the response as a JSON array of objects, each containing: 
  id, text, options (array of 4 choices), correctAnswer, difficulty (easy, medium, hard), bloomsCategory, and competency.`;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const content = response.data.choices[0].message.content;
    const jsonStart = content.indexOf('[');
    const jsonEnd = content.lastIndexOf(']') + 1;
    const jsonString = content.slice(jsonStart, jsonEnd);
    const questions = JSON.parse(jsonString);

    // Ensure each question has a valid competency
    return questions.map(question => ({
      ...question,
      competency: competencies.includes(question.competency) ? question.competency : competencies[0]
    }));
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    throw error;
  }
};
