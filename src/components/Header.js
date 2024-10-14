import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout }) => (
  <header className="bg-purple-600 text-white p-4">
    <nav className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">MThree Recruitment</Link>
      <div>
        <Link 
          to={user ? "/chat" : "#"} 
          className={`bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded mr-4 ${!user && 'opacity-50 cursor-not-allowed'}`}
          onClick={(e) => !user && e.preventDefault()}
        >
          Technical Chat Support
        </Link>
        <Link 
          to={user ? "/moodle" : "#"} 
          className={`bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded mr-4 ${!user && 'opacity-50 cursor-not-allowed'}`}
          onClick={(e) => !user && e.preventDefault()}
        >
          Moodle LMS
        </Link>
        <Link 
          to={user ? "/content-creation" : "#"} 
          className={`bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded mr-4 ${!user && 'opacity-50 cursor-not-allowed'}`}
          onClick={(e) => !user && e.preventDefault()}
        >
          Content Creation
        </Link>
        <Link 
          to={user ? "/marketing-image" : "#"} 
          className={`bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded mr-4 ${!user && 'opacity-50 cursor-not-allowed'}`}
          onClick={(e) => !user && e.preventDefault()}
        >
          Marketing Image Generator
        </Link>
        {user ? (
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
        ) : (
          <Link to="/" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Login</Link>
        )}
      </div>
    </nav>
  </header>
);

export default Header;
