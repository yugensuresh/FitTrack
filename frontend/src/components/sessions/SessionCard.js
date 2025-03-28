import React from 'react';
import { Link } from 'react-router-dom';

const SessionCard = ({ session, onDelete }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-warning';
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <span className={`badge ${getStatusBadgeClass(session.Status)}`}>
          {session.Status}
        </span>
        <small className="text-muted">{formatDate(session.Session_DateTime)}</small>
      </div>
      <div className="card-body">
        <h5 className="card-title">{session.Workout_Type}</h5>
        <p className="card-text mb-1">
          <strong>Trainer:</strong> {session.Trainer_ID}
        </p>
        <p className="card-text mb-1">
          <strong>Duration:</strong> {session.Duration} min
        </p>
        {session.Notes && (
          <p className="card-text">
            <small className="text-muted">{session.Notes.substring(0, 50)}
              {session.Notes.length > 50 ? '...' : ''}
            </small>
          </p>
        )}
      </div>
      <div className="card-footer bg-white border-top-0">
        <div className="d-flex justify-content-between">
          <Link to={`/sessions/${session._id}`} className="btn btn-sm btn-outline-primary">
            View Details
          </Link>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(session._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard; //SessionCard