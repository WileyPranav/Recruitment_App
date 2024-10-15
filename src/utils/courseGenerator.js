import axios from 'axios';


const parseMarkdownToStructure = (markdown) => {
  const lines = markdown.split('\n');
  const structure = {
    title: '',
    overview: '',
    learningOutcomes: [],
    technologyOverview: '',
    prerequisites: [],
    systemRequirements: [],
    weeks: []
  };
  let currentSection = null;
  let currentWeek = null;
  let currentDay = null;

  lines.forEach(line => {
    if (line.startsWith('# Course Title:')) {
      structure.title = line.replace('# Course Title:', '').trim();
    } else if (line.startsWith('## Course Overview')) {
      currentSection = 'overview';
    } else if (line.startsWith('## Learning Outcomes')) {
      currentSection = 'learningOutcomes';
    } else if (line.startsWith('## Technology Overview')) {
      currentSection = 'technologyOverview';
    } else if (line.startsWith('## Prerequisites')) {
      currentSection = 'prerequisites';
    } else if (line.startsWith('## System Requirements')) {
      currentSection = 'systemRequirements';
    } else if (line.startsWith('## Week')) {
      currentSection = 'weeks';
      currentWeek = { weekNumber: line.split(' ')[2], days: [] };
      structure.weeks.push(currentWeek);
    } else if (line.startsWith('### Day')) {
      currentDay = { dayNumber: line.split(' ')[2], content: { topics: [], objectives: [], activities: [] } };
      currentWeek.days.push(currentDay);
    } else if (line.startsWith('#### Topics Covered')) {
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
        case 'prerequisites':
          if (line.startsWith('- ')) structure.prerequisites.push(line.slice(2));
          break;
        case 'systemRequirements':
          if (line.startsWith('- ')) structure.systemRequirements.push(line.slice(2));
          break;
        case 'topics':
          if (line.match(/^\d+\./)) currentDay.content.topics.push(line.replace(/^\d+\./, '').trim());
          break;
        case 'objectives':
          if (line.match(/^\d+\./)) currentDay.content.objectives.push(line.replace(/^\d+\./, '').trim());
          break;
        case 'activities':
          if (line.match(/^\d+\./)) currentDay.content.activities.push(line.replace(/^\d+\./, '').trim());
          break;
      }
    }
  });

  return structure;
};

export const generateCourseStructure = async (jobDescription, duration, technology, targetAudience) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OpenAI API key is not set. Please check your .env file.');
    throw new Error('OpenAI API key is not set');
  }

  const prompt = `Create a comprehensive and detailed course outline for a ${duration} training program on ${technology}, based on this job description: ${jobDescription}. The course should be tailored for ${targetAudience}. 

Please structure your response exactly as follows:

# Course Title: [Provide a concise title]

## Course Overview
[Provide a brief overview of the course, its objectives, and its relevance to the job description]

## Learning Outcomes
- [Describe a specific, measurable learning outcome]
- [Describe another specific, measurable learning outcome]
- [Add more outcomes as necessary, aim for 4-6 total]

## Technology Overview
[Provide a concise overview of ${technology}, its importance, and its relevance to the job description]

## Prerequisites
- [List a prerequisite]
- [List another prerequisite]
- [Continue as needed]

## System Requirements
- [List a system requirement]
- [List another system requirement]
- [Continue as needed]

[For each week, use the following structure. Repeat for the number of weeks in the ${duration} program]

## Week 1

### Day 1
#### Topics Covered
1. [Topic 1]
2. [Topic 2]
3. [Topic 3]
4. [Topic 4]
5. [Topic 5]

#### Learning Objectives
1. [Objective 1]
2. [Objective 2]
3. [Objective 3]

#### Activities
1. [Activity 1]
2. [Activity 2]

[Repeat the Day structure for each day of the week]

### Day 2
...

[Repeat the Week structure for each week of the program]

## Week 2
...

Ensure that:
1. The course content builds progressively over the duration.
2. Each day includes at least 5 detailed topics, 3 specific learning objectives, and 2 hands-on activities.
3. The content is tailored to the ${targetAudience} level.
4. The course aligns closely with the provided job description and the ${technology} focus.
5. The structure is detailed, modular, and follows the exact format provided above.`;

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
    //console.log("Raw response:", content);
    const parsedStructure = parseMarkdownToStructure(content);
    //console.log("Parsed structure:", parsedStructure);
    return parsedStructure;
  } catch (error) {
    console.error('Error generating course structure:', error.response ? error.response.data : error.message);
    throw error;
  }
};