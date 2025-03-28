import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // For demo purposes - in a real app, you'd get this from auth/context
  const memberId = "M001";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch member stats
        const statsData = await sessionService.getMemberStats(memberId);
        setStats(statsData);
        
        // Fetch upcoming sessions
        const sessions = await sessionService.getSessions({ upcoming: true, member_id: memberId });
        setUpcomingSessions(sessions);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [memberId]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
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
        <h1>Workout Dashboard</h1>
        <Link to="/sessions/create" className="btn btn-primary">
          New Session
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          {stats && (
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center">
                    <h2 className="display-4 text-primary">{stats.totalSessions}</h2>
                    <p className="text-muted mb-0">Total Sessions</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center">
                    <h2 className="display-4 text-success">{stats.completedSessions}</h2>
                    <p className="text-muted mb-0">Completed</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center">
                    <h2 className="display-4 text-info">{stats.upcomingSessions}</h2>
                    <p className="text-muted mb-0">Upcoming</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Sessions */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Upcoming Sessions</h5>
                <Link to="/sessions" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body">
              {upcomingSessions.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Trainer</th>
                        <th>Workout Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingSessions.map(session => (
                        <tr key={session._id}>
                          <td>{formatDate(session.Session_DateTime)}</td>
                          <td>{session.Trainer_ID}</td>
                          <td>{session.Workout_Type}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(session.Status)}`}>
                              {session.Status}
                            </span>
                          </td>
                          <td>
                            <Link to={`/sessions/${session._id}`} className="btn btn-sm btn-outline-secondary">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-3">No upcoming sessions scheduled.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; //Dashboard