import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const WelcomePage = () => (
  <Layout>
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-5xl font-bold mb-8 text-primary-dark">Welcome to MThree Recruitment</h1>
    <p className="mb-8 text-xl text-gray-700 max-w-2xl mx-auto">
      MThree is a global recruiting company partnering with leading banks worldwide. Start your journey with us today!
    </p>
    <Link to="/recruitment" className="bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 inline-block">
      Begin Recruitment Process
    </Link>
    <p className="mt-4 text-gray-600">
      Need support? <Link to="/chat" className="text-primary hover:underline">Chat with our assistant</Link>
    </p>
      </div>
  </Layout>
);

export default WelcomePage;