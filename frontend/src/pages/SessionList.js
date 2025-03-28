import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sessionService } from '../services/api';

const SessionList = () => {
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(location.state?.message || null);
  const [messageType, setMessageType] = useState(location.state?.type || 'info');
  const [filters, setFilters] = useState({
    status: '',
    member_id: 'M001' // Hardcoded for demo - would come from auth context in real app
  });

  useEffect(() => {
    fetchSessions();
    
    // Clear location state
    if (location.state) {
      window.history.replaceState({}, document.title);
    }
    
    // Auto-dismiss success message after 3 seconds
    if (message && messageType === 'success') {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [filters, location.state]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getSessions(filters);
      setSessions(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions. Please try again later.');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionService.deleteSession(id);
        // Remove the deleted session from state
        setSessions(sessions.filter(session => session._id !== id));
        setMessage('Session deleted successfully');
        setMessageType('success');
      } catch (err) {
        console.error('Error deleting session:', err);
        setError('Failed to delete session. Please try again.');
      }
    }
  };

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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Workout Sessions</h1>
        <Link to="/sessions/create" className="btn btn-primary">
          New Session
        </Link>
      </div>

      {message && (
        <div className={`alert alert-${messageType}`} role="alert">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Filter Controls */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="statusFilter" className="form-label">Status</label>
              <select 
                id="statusFilter" 
                name="status" 
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-8 d-flex align-items-end">
              <button 
                className="btn btn-secondary ms-2"
                onClick={() => setFilters({...filters, status: ''})}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {sessions.length > 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Trainer</th>
                        <th>Workout Type</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map(session => (
                        <tr key={session._id}>
                          <td>{formatDate(session.Session_DateTime)}</td>
                          <td>{session.Trainer_ID}</td>
                          <td>{session.Workout_Type}</td>
                          <td>{session.Duration} min</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(session.Status)}`}>
                              {session.Status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link 
                                to={`/sessions/${session._id}`} 
                                className="btn btn-outline-primary"
                              >
                                View
                              </Link>
                              <Link 
                                to={`/sessions/${session._id}/edit`} 
                                className="btn btn-outline-secondary"
                              >
                                Edit
                              </Link>
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(session._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-info text-center">
              No sessions found matching your criteria.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SessionList; // SessionList