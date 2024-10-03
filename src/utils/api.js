import axios from 'axios';

export const generateQuestions = async (technology) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OpenAI API key is not set. Please check your .env file.');
    throw new Error('OpenAI API key is not set');
  }

  const prompt = `Generate 30 multiple-choice questions for a ${technology} interview. Focuson the core technology. 
  The questions should increase in difficulty and be divided into Bloom's Taxonomy categories: 
  Remember, Understand, Apply, Analyze, and Create. Make sure all the questions that you give have 4 options. includine relevant coding & debugging questions in this. 
  If the question is related to coding then have 4 sample codes to select from, and these 4 options should have a correct solution as well.

  Make the questions scenario-based rather than having direct answers. like Comprehension, Application, Analysis, Evaluation, and Creation.
  Format the response as a JSON array of objects, each containing: 
  id, text, options (array of 4 choices), correctAnswer, difficulty (easy, medium, hard), and bloomsCategory.`;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const content = response.data.choices[0].message.content;
    const jsonStart = content.indexOf('[');
    const jsonEnd = content.lastIndexOf(']') + 1;
    const jsonString = content.slice(jsonStart, jsonEnd);
    console.log(jsonString);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    throw error;
  }
};