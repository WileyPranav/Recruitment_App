import axios from 'axios';

const parseMarkdownToStructure = (markdown) => {
  const lines = markdown.split('\n');
  const structure = {
    overview: '',
    learningOutcomes: [],
    technologyOverview: '',
    weeks: []
  };
  let currentSection = null;
  let currentWeek = null;
  let currentDay = null;

  lines.forEach(line => {
    if (line.startsWith('# Course Overview')) {
      currentSection = 'overview';
    } else if (line.startsWith('# Learning Outcomes')) {
      currentSection = 'learningOutcomes';
    } else if (line.startsWith('# Technology Overview')) {
      currentSection = 'technologyOverview';
    } else if (line.startsWith('## Week')) {
      currentSection = 'weeks';
      currentWeek = { weekNumber: line.split(' ')[2], days: [] };
      structure.weeks.push(currentWeek);
    } else if (line.startsWith('### Day')) {
      currentDay = { dayNumber: line.split(' ')[2], content: { topics: [], objectives: [], activities: [] } };
      currentWeek.days.push(currentDay);
    } else if (line.startsWith('#### Topics')) {
      currentSection = 'topics';
    } else if (line.startsWith('#### Learning Objectives')) {
      currentSection = 'objectives';
    } else if (line.startsWith('#### Activities')) {
      currentSection = 'activities';
    } else if (line.trim() !== '') {
      switch (currentSection) {
        case 'overview':
          structure.overview += line + '\n';
          break;
        case 'learningOutcomes':
          if (line.startsWith('- ')) structure.learningOutcomes.push(line.slice(2));
          break;
        case 'technologyOverview':
          structure.technologyOverview += line + '\n';
          break;
        case 'topics':
          if (line.startsWith('- ')) currentDay.content.topics.push(line.slice(2));
          break;
        case 'objectives':
          if (line.startsWith('- ')) currentDay.content.objectives.push(line.slice(2));
          break;
        case 'activities':
          if (line.startsWith('- ')) currentDay.content.activities.push(line.slice(2));
          break;
      }
    }
  });

  return structure;
};

export const generateCourseStructure = async (jobDescription, duration, technology) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OpenAI API key is not set. Please check your .env file.');
    throw new Error('OpenAI API key is not set');
  }

  const prompt = `Create a comprehensive and detailed course outline for a ${duration} training program on ${technology} based on this job description: ${jobDescription}.  Make sure to get back with the entire course structure for the required duration explicitly. Do not miss out any days or weeks.

  Start with:
  1. A brief course overview
  2. Clear learning outcomes
  3. A technology/topic overview
  
  Then provide a week-by-week breakdown, with each week having 5 days of 6hrs training each. For each day, include:
  1. Detailed topics covered (minimum 5 bullet points)
  2. Specific learning objectives (minimum 3 bullet points)
  3. Hands-on activities or exercises (minimum 2 bullet points)
  
  Ensure the content flows seamlessly over the duration, building upon previous days' learning. Make sure the course structure is closely aligned with the job description and the technology. Keep the course structure as detailed and modular as possible.

  Use the following markdown format:

  # Course Overview
  (Brief overview of the course)

  # Learning Outcomes
  - Outcome 1
  - Outcome 2
  (etc.)

  # Technology Overview
  (Overview of the technology and its importance)

  ## Week 1
  ### Day 1
  #### Topics
  - Topic 1
  - Topic 2
  (etc.)
  #### Learning Objectives
  - Objective 1
  - Objective 2
  (etc.)
  #### Activities
  - Activity 1
  - Activity 2
  (etc.)

  ### Day 2
  (... and so on for each day and all the weeks)`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant that creates structured course outlines." },
          { role: "user", content: prompt }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    console.log("Raw response:", content);
    const parsedStructure = parseMarkdownToStructure(content);
    console.log("Parsed structure:", parsedStructure);
    return parsedStructure;
  } catch (error) {
    console.error('Error generating course structure:', error.response ? error.response.data : error.message);
    throw error;
  }
};