import Together from "together-ai";

const TOGETHER_API_KEY = process.env.REACT_APP_TOGETHER_API_KEY;

const together = new Together({apiKey: TOGETHER_API_KEY});

export const generateImage = async (prompt) => {
  try {
    const response = await together.images.create({
      prompt: prompt,
      model: "black-forest-labs/FLUX.1-schnell-Free",
      width: 1024,
      height: 768,
      steps: 3,
      response_format: "base64",
    });

    if (response.data && response.data.length > 0 && response.data[0].b64_json) {
      return response.data[0].b64_json;
    } else {
      throw new Error('No image data found in the response');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
