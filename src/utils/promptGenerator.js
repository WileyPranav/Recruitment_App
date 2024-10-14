import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const generateDetailedPrompt = async (idea) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a creative assistant that generates detailed image prompts for marketing materials." },
          { role: "user", content: `Generate a detailed image prompt for the following idea: ${idea}. Include specific details about composition, style, colors, and mood. The prompt should be suitable for a high-quality image generation model.` }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating detailed prompt:', error);
    throw error;
  }
};
