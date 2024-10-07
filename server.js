const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userName } = req.body;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable and encouraging technical support assistant, dedicated to helping candidates navigate their training in Java, Python, SRE, DevOps, and AI. Address the user as ${userName}.`
        },
        ...messages
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ message: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.post('/api/generate-course', async (req, res) => {
  try {
    const { jobDescription, duration, technology } = req.body;

    const prompt = `Create a structured course outline for a ${duration} training program on ${technology} based on this job description: ${jobDescription}. Provide a week-by-week breakdown, with each week having 5 days of 6hrs training each. Create a detailed course structure containing daily topics, objectives, and activities. Make sure the course structure is aligned with the job description and the technology. Keep the course structure as detailed and modular as possible.`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "You are a helpful assistant that creates structured course outlines." },
        { role: "user", content: prompt }
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const content = response.data.choices[0].message.content;
    res.json(JSON.parse(content));
  } catch (error) {
    console.error('Error generating course structure:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate course structure' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));