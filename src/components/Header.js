import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-purple-600 text-white p-4">
      <nav className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">MThree Recruitment</Link>
          <button
            className="lg:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        <div className={`lg:flex ${isMenuOpen ? 'block' : 'hidden'} mt-4 lg:mt-0`}>
          <Link 
            to={user ? "/chat" : "#"} 
            className={`block lg:inline-block mt-2 lg:mt-0 lg:mr-4 px-4 py-2 rounded ${!user && 'opacity-50 cursor-not-allowed'} hover:bg-purple-700`}
            onClick={(e) => !user && e.preventDefault()}
          >
            Technical Chat Support
          </Link>
          <Link 
            to={user ? "/moodle" : "#"} 
            className={`block lg:inline-block mt-2 lg:mt-0 lg:mr-4 px-4 py-2 rounded ${!user && 'opacity-50 cursor-not-allowed'} hover:bg-purple-700`}
            onClick={(e) => !user && e.preventDefault()}
          >
            Moodle LMS
          </Link>
          <Link 
            to={user ? "/content-creation" : "#"} 
            className={`block lg:inline-block mt-2 lg:mt-0 lg:mr-4 px-4 py-2 rounded ${!user && 'opacity-50 cursor-not-allowed'} hover:bg-purple-700`}
            onClick={(e) => !user && e.preventDefault()}
          >
            Content Creation
          </Link>
          <Link 
            to={user ? "/marketing-image" : "#"} 
            className={`block lg:inline-block mt-2 lg:mt-0 lg:mr-4 px-4 py-2 rounded ${!user && 'opacity-50 cursor-not-allowed'} hover:bg-purple-700`}
            onClick={(e) => !user && e.preventDefault()}
          >
            Marketing Image Generator
          </Link>
          {user ? (
            <button onClick={onLogout} className="block lg:inline-block mt-2 lg:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
          ) : (
            <Link to="/" className="block lg:inline-block mt-2 lg:mt-0 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
