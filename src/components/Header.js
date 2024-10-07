import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout }) => (
  <header className="bg-primary text-white p-4">
    <nav className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">MThree Recruitment</Link>
      <div>
        <Link 
          to={user ? "/chat" : "#"} 
          className={`bg-secondary hover:bg-secondary-dark px-4 py-2 rounded mr-4 ${!user && 'opacity-50 cursor-not-allowed'}`}
          onClick={(e) => !user && e.preventDefault()}
        >
          Technical Chat Support
        </Link>
        <Link 
          to={user ? "/moodle" : "#"} 
          className={`bg-secondary hover:bg-secondary-dark px-4 py-2 rounded mr-4 ${!user && 'opacity-50 cursor-not-allowed'}`}
          onClick={(e) => !user && e.preventDefault()}
        >
          Moodle LMS
        </Link>
        {user ? (
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
        ) : (
          <Link to="/" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">Login</Link>
        )}
      </div>
    </nav>
  </header>
);

export default Header;