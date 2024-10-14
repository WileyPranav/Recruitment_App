import React, { useState } from 'react';
import { generateDetailedPrompt } from '../utils/promptGenerator';
import { generateImage } from '../utils/imageGenerator';

// Helper function to clean and format the prompt
const cleanPrompt = (text) => {
  return text
    .replace(/[^\w\s.,!?-]/g, '') // Remove special characters except basic punctuation
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim() // Remove leading and trailing whitespace
    .replace(/\s+([.,!?])/g, '$1') // Remove spaces before punctuation
    .replace(/\s*-\s*/g, '-') // Clean up hyphens
    .replace(/\s+/g, ' '); // Final cleanup of any remaining extra spaces
};

const MarketingImageGenerator = () => {
  const [idea, setIdea] = useState('');
  const [detailedPrompt, setDetailedPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(null);


  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompt(true);
    setError(null);
    try {
      const prompt = await generateDetailedPrompt(idea);
      setDetailedPrompt(cleanPrompt(prompt));
    } catch (err) {
      setError('Failed to generate detailed prompt. Please try again.');
    }
    setIsGeneratingPrompt(false);
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setError(null);
    try {
      const cleanedPrompt = cleanPrompt(detailedPrompt);
      const generatedImageData = await generateImage(cleanedPrompt);
      setImageData(generatedImageData);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
    }
    setIsGeneratingImage(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Marketing Image Generator</h1>
      
      <div className="mb-6">
        <label htmlFor="idea" className="block mb-2 font-bold">Your Image Idea:</label>
        <textarea
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="w-full p-2 border rounded"
          rows="3"
          placeholder="Enter your image idea here..."
        />
        <button
          onClick={handleGeneratePrompt}
          disabled={isGeneratingPrompt || !idea.trim()}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isGeneratingPrompt ? 'Generating...' : 'Generate Detailed Prompt'}
        </button>
      </div>

      {detailedPrompt && (
        <div className="mb-6">
          <label htmlFor="detailedPrompt" className="block mb-2 font-bold">Detailed Prompt:</label>
          <textarea
            id="detailedPrompt"
            value={detailedPrompt}
            onChange={(e) => setDetailedPrompt(e.target.value)}
            className="w-full p-2 border rounded"
            rows="6"
          />
          <button
            onClick={handleGenerateImage}
            disabled={isGeneratingImage || !detailedPrompt.trim()}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isGeneratingImage ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {imageData && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Generated Image:</h2>
          <img src={`data:image/png;base64,${imageData}`} alt="Generated marketing image" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default MarketingImageGenerator;
