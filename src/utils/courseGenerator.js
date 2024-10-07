import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

export const generateCourseStructure = async (jobDescription, duration, technology) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates structured course outlines."
        },
        {
          role: "user",
          content: `Create a structured course outline for a ${duration} training program on ${technology} based on this job description: ${jobDescription}. Provide a week-by-week breakdown, with each week containing daily topics, objectives, and activities.`
        }
      ],
    });

    const courseStructure = JSON.parse(response.choices[0].message.content);
    return courseStructure;
  } catch (error) {
    console.error('Error generating course structure:', error);
    return null;
  }
};