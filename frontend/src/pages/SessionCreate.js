import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '../services/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const SessionCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionDateTime, setSessionDateTime] = useState(new Date());
  
  // Initial form state
  const [formData, setFormData] = useState({
    Member_ID: 'M001', // Hardcoded for demo
    Trainer_ID: '',
    Workout_Type: '',
    Duration: 60,
    Notes: '',
    Status: 'pending'
  });

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
      setLoading(true);
      setError(null);
      
      // Prepare data with the session date/time
      const sessionData = {
        ...formData,
        Session_DateTime: sessionDateTime.toISOString()
      };
      
      await sessionService.createSession(sessionData);
      
      // Redirect to sessions list with success message
      navigate('/sessions', { 
        state: { message: 'Session created successfully!', type: 'success' } 
      });
    } catch (err) {
      console.error('Error creating session:', err);
      setError(err.response?.data?.error || 'Failed to create session. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h1 className="h3 mb-0">Create New Session</h1>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
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
                  <button 
                    type="button" 
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate('/sessions')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : 'Create Session'}
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

export default SessionCreate;