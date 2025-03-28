import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light py-3 mt-auto">
      <div className="container text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} Workout Session Manager</p>
      </div>
    </footer>
  );
};

export default Footer; //Footer