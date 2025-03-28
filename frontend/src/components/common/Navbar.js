import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Workout Session Manager</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/sessions">Sessions</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/sessions/create">New Session</NavLink>
            </li>
          </ul>
        </div>
        <div className="d-flex">
          <span className="navbar-text text-white">
            Member: M001
          </span>
        </div>
      </div>
    </nav>
  );
};



export default Navbar;
