import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sessionService } from '../services/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Loader from '../components/common/Loader';

const SessionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [sessionDateTime, setSessionDateTime] = useState(new Date());
  
  // Form state
  const [formData, setFormData] = useState({
    Member_ID: '',
    Trainer_ID: '',
    Workout_Type: '',
    Duration: 60,
    Notes: '',
    Status: 'pending'
  });

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const session = await sessionService.getSessionById(id);
        
        // Update form data
        setFormData({
          Member_ID: session.Member_ID,
          Trainer_ID: session.Trainer_ID,
          Workout_Type: session.Workout_Type,
          Duration: session.Duration,
          Notes: session.Notes || '',
          Status: session.Status
        });
        
        // Set session date time
        setSessionDateTime(new Date(session.Session_DateTime));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to load session data. Please try again.');
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Prepare data with the session date/time
      const sessionData = {
        ...formData,
        Session_DateTime: sessionDateTime.toISOString()
      };
      
      await sessionService.updateSession(id, sessionData);
      
      // Redirect to session details with success message
      navigate(`/sessions/${id}`, { 
        state: { message: 'Session updated successfully!', type: 'success' } 
      });
    } catch (err) {
      console.error('Error updating session:', err);
      setError(err?.response?.data?.error || 'Failed to update session. Please try again.');
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to="/sessions">Sessions</Link></li>
          <li className="breadcrumb-item"><Link to={`/sessions/${id}`}>Session Details</Link></li>
          <li className="breadcrumb-item active">Edit Session</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h1 className="h3 mb-0">Edit Session</h1>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="memberID" className="form-label">Member ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="memberID"
                    name="Member_ID"
                    value={formData.Member_ID}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="trainerID" className="form-label">Trainer ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="trainerID"
                    name="Trainer_ID"
                    value={formData.Trainer_ID}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="sessionDateTime" className="form-label">Date & Time</label>
                  <DatePicker
                    id="sessionDateTime"
                    className="form-control"
                    selected={sessionDateTime}
                    onChange={(date) => setSessionDateTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="workoutType" className="form-label">Workout Type</label>
                  <select
                    className="form-select"
                    id="workoutType"
                    name="Workout_Type"
                    value={formData.Workout_Type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Workout Type</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Cardio">Cardio</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Pilates">Pilates</option>
                    <option value="CrossFit">CrossFit</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="duration" className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="duration"
                    name="Duration"
                    min="15"
                    max="180"
                    step="15"
                    value={formData.Duration}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    className="form-select"
                    id="status"
                    name="Status"
                    value={formData.Status}
                    onChange={handleChange}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="Notes"
                    rows="3"
                    value={formData.Notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link
                    to={`/sessions/${id}`}
                    className="btn btn-secondary me-md-2"
                  >
                    Cancel
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionEdit; //SessionEdit
