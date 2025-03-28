import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const SessionForm = ({ 
  initialData, 
  onSubmit, 
  loading, 
  submitButtonText = 'Submit',
  cancelPath = '/sessions'
}) => {
  const [formData, setFormData] = useState(initialData || {
    Member_ID: 'M001', // Default member ID (in a real app, this might come from auth)
    Trainer_ID: '',
    Workout_Type: '',
    Duration: 60,
    Notes: '',
    Status: 'pending'
  });
  
  const [sessionDateTime, setSessionDateTime] = useState(
    initialData?.Session_DateTime ? new Date(initialData.Session_DateTime) : new Date()
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data with the session date/time
    const sessionData = {
      ...formData,
      Session_DateTime: sessionDateTime.toISOString()
    };
    
    onSubmit(sessionData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Member ID field is typically not editable in most UIs */}
      <input type="hidden" name="Member_ID" value={formData.Member_ID} />
      
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
      
      {/* Show status field only for editing, not for creation */}
      {initialData?.Status && (
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
      )}
      
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
          to={cancelPath}
          className="btn btn-secondary me-md-2"
        >
          Cancel
        </Link>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Submitting...
            </>
          ) : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default SessionForm; //SessionForm