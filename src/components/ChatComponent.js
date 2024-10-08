import React, { useState, useEffect } from 'react';
import axios from 'axios';

const stripMarkdownAndHtml = (text) => {
  // Remove HTML tags
  let stripped = text.replace(/<[^>]*>/g, '');
  // Remove Markdown syntax
  stripped = stripped.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Bold
  stripped = stripped.replace(/(\*|_)(.*?)\1/g, '$2'); // Italic
  stripped = stripped.replace(/#{1,6}\s?([^#\n]+)/g, '$1'); // Headers
  stripped = stripped.replace(/`{3}[\s\S]*?`{3}/g, ''); // Code blocks
  stripped = stripped.replace(/`([^`]+)`/g, '$1'); // Inline code
  stripped = stripped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'); // Links
  stripped = stripped.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, ''); // Images
  stripped = stripped.replace(/^>(.+)/gm, '$1'); // Blockquotes
  stripped = stripped.replace(/^[-*+]\s(.+)/gm, '$1'); // Unordered lists
  stripped = stripped.replace(/^\d+\.\s(.+)/gm, '$1'); // Ordered lists
  return stripped.trim();
};

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const initialMessage = {
      text: "Hello! I'm your Technical support assistant. I'm here to help you navigate any doubts you might be facing. To get started, could you please tell me your name?",
      sender: 'bot'
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const extractName = async (input) => {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant that extracts names from text. Respond with only the extracted name." },
          { role: "user", content: `Extract the name from this text: "${input}"` }
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error extracting name:', error);
      return input.split(' ')[0]; // Fallback to first word if API call fails
    }
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      if (!userName) {
        const extractedName = await extractName(input);
        setUserName(extractedName);
        const nameResponse = {
          text: stripMarkdownAndHtml(`It's nice to meet you, ${extractedName}! Could you tell me a little bit about yourself and what brings you here today?`),
          sender: 'bot'
        };
        setMessages(prevMessages => [...prevMessages, nameResponse]);
        setIsTyping(false);
        return;
      }

      if (!introComplete) {
        setIntroComplete(true);
        const introResponse = {
          text: stripMarkdownAndHtml(`Thank you for sharing that, ${userName}. I'm here to support you through any technical challenges you might be facing. Feel free to ask me anything or share what's on your mind.`),
          sender: 'bot'
        };
        setMessages(prevMessages => [...prevMessages, introResponse]);
        setIsTyping(false);
        return;
      }

      const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
      
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a knowledgeable and encouraging technical support assistant, dedicated to helping candidates navigate their training in Java, Python, SRE, DevOps, and AI. Address the user as ${userName}. Provide responses in an easy-to-understand bullet point format, using simple language suitable for beginners in the domain. Start each main point with a • and use - for sub-points if needed.`
          },
          ...messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          { role: "user", content: input }
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const botMessage = {
        text: stripMarkdownAndHtml(response.data.choices[0].message.content),
        sender: 'bot'
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: `I'm sorry, ${userName}, I'm having trouble responding right now. Can you please try again?`,
        sender: 'bot'
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }

    setIsTyping(false);
  };

  const handleLike = (index) => {
    console.log(`Liked message at index ${index}`);
    // You can implement additional functionality here, such as sending feedback to a server
  };

  const handleDislike = (index) => {
    console.log(`Disliked message at index ${index}`);
    // You can implement additional functionality here, such as sending feedback to a server
  };

  const handleRegenerate = async (index) => {
    if (index === messages.length - 1 && messages[index].sender === 'bot') {
      setIsTyping(true);
      try {
        const response = await axios.post('/api/chat', {
          messages: [
            ...messages.slice(0, -1).map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: "user", content: "Please provide a different response to my last message." }
          ],
          userName: userName
        });

        const regeneratedMessage = {
          text: stripMarkdownAndHtml(response.data.message),
          sender: 'bot'
        };
        setMessages(prevMessages => [...prevMessages.slice(0, -1), regeneratedMessage]);
      } catch (error) {
        console.error('Error regenerating response:', error);
      }
      setIsTyping(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Chat Support</h2>
      <div id="chat-container" className="bg-gray-100 p-4 h-96 overflow-y-auto mb-4 rounded">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white'}`}>
              {message.text.split('\n').map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
            </span>
            {message.sender === 'bot' && (
              <div className="mt-2 flex justify-start space-x-2">
                <button onClick={() => handleLike(index)} className="text-green-500 hover:text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </button>
                <button onClick={() => handleDislike(index)} className="text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01-.8-2.4L6.8 7.933a4 4 0 00-.8-2.4z" />
                  </svg>
                </button>
                <button onClick={() => handleRegenerate(index)} className="text-blue-500 hover:text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="text-left">
            <span className="inline-block p-2 rounded bg-gray-300">Typing...</span>
          </div>
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-grow p-2 border rounded-l"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="bg-primary text-white p-2 rounded-r">Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;