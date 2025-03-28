import React from 'react';

const Loader = ({ size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  
  return (
    <div className="text-center py-3">
      <div className={`spinner-border text-primary ${sizeClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader; //Loader