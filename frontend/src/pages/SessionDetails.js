import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sessionService } from '../services/api';
import Loader from '../components/common/Loader';

const SessionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  
  // Progress form state
  const [progressForm, setProgressForm] = useState({
    exercise: '',
    sets: 3,
    reps: 10,
    weight: 0
  });
  const [progressLoading, setProgressLoading] = useState(false);

  useEffect(() => {
    fetchSessionDetails();
  }, [id]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getSessionById(id);
      setSession(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching session details:', err);
      setError('Failed to load session details. Please try again later.');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      const statusData = { Status: newStatus };
      
      if (newStatus === 'completed') {
        statusData.Attendance = true;
      }
      
      const response = await sessionService.updateSessionStatus(id, statusData);
      setSession(response.session);
      setMessage(`Session marked as ${newStatus}`);
      setMessageType('success');
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error updating session status:', err);
      setError('Failed to update session status. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionService.deleteSession(id);
        navigate('/sessions', { 
          state: { message: 'Session deleted successfully', type: 'success' } 
        });
      } catch (err) {
        console.error('Error deleting session:', err);
        setError('Failed to delete session. Please try again.');
      }
    }
  };

  const handleProgressChange = (e) => {
    const { name, value } = e.target;
    setProgressForm({
      ...progressForm,
      [name]: name === 'exercise' ? value : Number(value)
    });
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setProgressLoading(true);
      const response = await sessionService.addProgress(id, progressForm);
      setSession(response.session);
      setMessage('Progress added successfully');
      setMessageType('success');
      setProgressLoading(false);
      
      // Reset form
      setProgressForm({
        exercise: '',
        sets: 3,
        reps: 10,
        weight: 0
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error adding progress:', err);
      setError('Failed to add progress. Please try again.');
      setProgressLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading && !session) return <Loader />;

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to="/sessions">Sessions</Link></li>
          <li className="breadcrumb-item active">Session Details</li>
        </ol>
      </nav>

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

      {session && (
        <>
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="h3 mb-0">Session Details</h1>
                <div>
                  <Link to={`/sessions/${id}/edit`} className="btn btn-sm btn-outline-primary me-2">
                    Edit
                  </Link>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Member ID:</strong> {session.Member_ID}</p>
                  <p><strong>Trainer ID:</strong> {session.Trainer_ID}</p>
                  <p><strong>Date & Time:</strong> {formatDate(session.Session_DateTime)}</p>
                  <p><strong>Workout Type:</strong> {session.Workout_Type}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Duration:</strong> {session.Duration} minutes</p>
                  <p>
                    <strong>Status:</strong> 
                    <span className={`badge ms-2 ${
                      session.Status === 'completed' ? 'bg-success' : 
                      session.Status === 'cancelled' ? 'bg-danger' : 'bg-warning'
                    }`}>
                      {session.Status}
                    </span>
                  </p>
                  <p>
                    <strong>Attendance:</strong> 
                    <span className={`badge ms-2 ${session.Attendance ? 'bg-success' : 'bg-secondary'}`}>
                      {session.Attendance ? 'Present' : 'Absent'}
                    </span>
                  </p>
                  {session.Notes && (
                    <p><strong>Notes:</strong> {session.Notes}</p>
                  )}
                </div>
              </div>

              {/* Status Update Buttons */}
              {session.Status === 'pending' && (
                <div className="mt-4">
                  <h5>Update Status</h5>
                  <div className="btn-group">
                    <button 
                      className="btn btn-success"
                      onClick={() => handleStatusUpdate('completed')}
                      disabled={loading}
                    >
                      Mark as Completed
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleStatusUpdate('cancelled')}
                      disabled={loading}
                    >
                      Cancel Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className="row">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h5 className="mb-0">Add Progress</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleProgressSubmit}>
                    <div className="mb-3">
                      <label htmlFor="exercise" className="form-label">Exercise</label>
                      <input
                        type="text"
                        className="form-control"
                        id="exercise"
                        name="exercise"
                        value={progressForm.exercise}
                        onChange={handleProgressChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="sets" className="form-label">Sets</label>
                      <input
                        type="number"
                        className="form-control"
                        id="sets"
                        name="sets"
                        min="1"
                        value={progressForm.sets}
                        onChange={handleProgressChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="reps" className="form-label">Reps</label>
                      <input
                        type="number"
                        className="form-control"
                        id="reps"
                        name="reps"
                        min="1"
                        value={progressForm.reps}
                        onChange={handleProgressChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="weight" className="form-label">Weight (lbs)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="weight"
                        name="weight"
                        min="0"
                        value={progressForm.weight}
                        onChange={handleProgressChange}
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={progressLoading}
                    >
                      {progressLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Adding...
                        </>
                      ) : 'Add Progress'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h5 className="mb-0">Progress History</h5>
                </div>
                <div className="card-body">
                  {session.Progress && session.Progress.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Exercise</th>
                            <th>Sets</th>
                            <th>Reps</th>
                            <th>Weight</th>
                          </tr>
                        </thead>
                        <tbody>
                          {session.Progress.map((progress, index) => (
                            <tr key={index}>
                              <td>{progress.exercise}</td>
                              <td>{progress.sets}</td>
                              <td>{progress.reps}</td>
                              <td>{progress.weight} lbs</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-3">No progress data available yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SessionDetails; //SessionDetails