import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const TOGETHER_API_KEY = process.env.REACT_APP_TOGETHER_API_KEY;

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

export const generateImage = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.together.xyz/inference',
      {
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt: prompt,
        negative_prompt: "low quality, blurry, distorted",
        width: 1024,
        height: 1024,
        steps: 3,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000),
        num_images: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // The API returns base64 encoded image data
    const imageData = response.data.output.image;
    return `data:image/png;base64,${imageData}`;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
