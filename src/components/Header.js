import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-primary text-white p-4">
    <nav className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">MThree Recruitment</Link>
      <div>
        <Link to="/chat" className="bg-secondary hover:bg-secondary-dark px-4 py-2 rounded mr-4">Technical Chat Support</Link>
        <Link to="/moodle" className="bg-secondary hover:bg-secondary-dark px-4 py-2 rounded">Moodle LMS</Link>
      </div>
    </nav>
  </header>
);

export default Header;