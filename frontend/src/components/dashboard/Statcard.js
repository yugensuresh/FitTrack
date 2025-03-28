import React from 'react';

const StatCard = ({ title, value, color = 'primary', icon }) => {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body text-center">
        {icon && (
          <div className={`text-${color} mb-3`}>
            <i className={`bi bi-${icon} fs-1`}></i>
          </div>
        )}
        <h2 className={`display-4 text-${color}`}>{value}</h2>
        <p className="text-muted mb-0">{title}</p>
      </div>
    </div>
  );
};

export default StatCard; //StatCard