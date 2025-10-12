import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateItinerary.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays, differenceInCalendarDays } from 'date-fns';

const initialActivity = {
  day: '',
  dateTime: null,
  activity: '',
  transport: '',
  location: '',
  stay: ''
};

const CreateItinerary = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [trip, setTrip] = useState({
    name: '',
    startPlace: '',
    endPlace: '',
    startDate: null,
    endDate: null,
    description: ''
  });
  const [activities, setActivities] = useState([]);
  const [activity, setActivity] = useState(initialActivity);
  const [editingActivityIdx, setEditingActivityIdx] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tripError, setTripError] = useState('');
  const [activityError, setActivityError] = useState('');
  const [editTripIdx, setEditTripIdx] = useState(null);

  // On mount, check if editing a trip
  useEffect(() => {
    const editTrip = JSON.parse(localStorage.getItem('editTrip') || 'null');
    if (editTrip) {
      setTrip({
        name: editTrip.name || editTrip.tripName || '',
        startPlace: editTrip.startPlace || '',
        endPlace: editTrip.endPlace || '',
        startDate: editTrip.startDate ? new Date(editTrip.startDate) : null,
        endDate: editTrip.endDate ? new Date(editTrip.endDate) : null,
        description: editTrip.description || ''
      });
      setActivities(
        (editTrip.activities || []).map(a => ({
          ...a,
          dateTime: a.dateTime ? new Date(a.dateTime) : null,
          activity: a.activity || a.name || ''
        }))
      );
      setEditTripIdx(editTrip.idx);
      localStorage.removeItem('editTrip');
    }
  }, []);

  // Validation helpers
  const isTripValid = trip.name && trip.startPlace && trip.endPlace && trip.startDate && trip.endDate;
  const isActivityValid = activity.day && activity.dateTime && activity.activity && activity.transport && activity.location && activity.stay;

  // Handle trip field changes
  const handleTripChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
    setTripError('');
  };

  // Handle date changes for trip
  const handleTripDateChange = (date, field) => {
    setTrip({ ...trip, [field]: date });
    setTripError('');
  };

  // Handle activity field changes
  const handleActivityChange = (e) => {
    setActivity({ ...activity, [e.target.name]: e.target.value });
    setActivityError('');
  };

  // Handle date-time change for activity
  const handleActivityDateChange = (date) => {
    setActivity({ ...activity, dateTime: date });
    setActivityError('');
  };

  // Add or update activity
  const handleAddActivity = () => {
    if (isActivityValid) {
      if (editingActivityIdx !== null) {
        const updated = [...activities];
        updated[editingActivityIdx] = activity;
        setActivities(updated);
        setEditingActivityIdx(null);
      } else {
        setActivities([...activities, activity]);
      }
      setActivity(initialActivity);
      setActivityError('');
    } else {
      setActivityError('Please fill all activity fields.');
    }
  };

  // Edit activity
  const handleEditActivity = (idx) => {
    setActivity(activities[idx]);
    setEditingActivityIdx(idx);
    setStep(2);
  };

  // Delete activity
  const handleDeleteActivity = (idx) => {
    const updated = [...activities];
    updated.splice(idx, 1);
    setActivities(updated);
  };

  // Go to next step if trip is valid
  const handleNext = (e) => {
    e.preventDefault();
    if (isTripValid) {
      setStep(2);
      setTripError('');
    } else {
      setTripError('Please fill all required fields.');
    }
  };

  // Go to day-to-day planner
  const handleToPlanner = (e) => {
    e.preventDefault();
    setStep(3);
  };

  // Go back to trip details
  const handleBack = () => {
    setStep(step === 2 ? 1 : 2);
    setEditingActivityIdx(null);
    setActivity(initialActivity);
  };

  // Save trip and activities
  const handleSave = async (e) => {
    e.preventDefault();
    if (activities.length === 0) {
      setActivityError('Add at least one activity before saving.');
      return;
    }
    setSaving(true);
    const tripsData = JSON.parse(localStorage.getItem('trips') || '[]');
    const tripObj = {
      tripName: trip.name,
      startPlace: trip.startPlace,
      endPlace: trip.endPlace,
      startDate: trip.startDate,
      endDate: trip.endDate,
      description: trip.description,
      activities: activities.map(a => ({
        ...a,
        name: a.activity,
        datetime: a.dateTime
      }))
    };
    if (editTripIdx !== null && tripsData[editTripIdx]) {
      tripsData[editTripIdx] = tripObj;
    } else {
      tripsData.push(tripObj);
    }
    localStorage.setItem('trips', JSON.stringify(tripsData));
    setTimeout(() => {
      setSaving(false);
      navigate('/dashboard');
    }, 1000);
  };

  // Generate days for planner
  const getDaysArray = () => {
    if (!trip.startDate || !trip.endDate) return [];
    const days = [];
    const totalDays = differenceInCalendarDays(trip.endDate, trip.startDate) + 1;
    for (let i = 0; i < totalDays; i++) {
      days.push(addDays(trip.startDate, i));
    }
    return days;
  };

  // Activities grouped by day (date string)
  const activitiesByDay = {};
  activities.forEach((a, idx) => {
    if (a.dateTime) {
      const dayStr = format(a.dateTime, 'yyyy-MM-dd');
      if (!activitiesByDay[dayStr]) activitiesByDay[dayStr] = [];
      activitiesByDay[dayStr].push({ ...a, idx });
    }
  });

  return (
    <div className="create-itinerary-container">
      <h2 className="create-itinerary-title">Create Trip</h2>
      {step === 1 && (
        <form className="create-itinerary-form" onSubmit={handleNext}>
          <label>
            Trip Name *
            <input name="name" aria-label="Trip Name" value={trip.name} onChange={handleTripChange} required placeholder="e.g. Summer Vacation" />
          </label>
          <label>
            Start Place *
            <input name="startPlace" aria-label="Start Place" value={trip.startPlace} onChange={handleTripChange} required placeholder="e.g. Bangalore" />
          </label>
          <label>
            End Place *
            <input name="endPlace" aria-label="End Place" value={trip.endPlace} onChange={handleTripChange} required placeholder="e.g. Goa" />
          </label>
          <label>
            Start Date *
            <DatePicker
              selected={trip.startDate}
              onChange={date => handleTripDateChange(date, 'startDate')}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select start date"
              className="create-itinerary-datepicker"
              aria-label="Start Date"
              required
            />
          </label>
          <label>
            End Date *
            <DatePicker
              selected={trip.endDate}
              onChange={date => handleTripDateChange(date, 'endDate')}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select end date"
              className="create-itinerary-datepicker"
              aria-label="End Date"
              required
            />
          </label>
          <label>
            Description
            <textarea name="description" aria-label="Description" value={trip.description} onChange={handleTripChange} placeholder="Describe your trip plans, goals, or any special notes..." />
          </label>
          {tripError && <div style={{ color: 'red', marginTop: 4 }}>{tripError}</div>}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type="submit" className="create-itinerary-btn-main" disabled={!isTripValid}>Next</button>
          </div>
        </form>
      )}
      {step === 2 && (
        <form className="create-itinerary-form" onSubmit={handleSave}>
          <h3 className="create-itinerary-activities-title">Activities & Itinerary</h3>
          <div className="create-itinerary-activity-fields">
            <div>
              <label>Day
                <select
                  name="day"
                  aria-label="Day"
                  value={activity.day}
                  onChange={handleActivityChange}
                  required
                  className="create-itinerary-day-select"
                  disabled={!trip.startDate || !trip.endDate}
                >
                  <option value="">Select day</option>
                  {trip.startDate && trip.endDate && (() => {
                    const days = [];
                    const totalDays = Math.max(1, Math.floor((trip.endDate - trip.startDate) / (1000 * 60 * 60 * 24)) + 1);
                    for (let i = 1; i <= totalDays; i++) {
                      days.push(<option key={i} value={`Day ${i}`}>{`Day ${i}`}</option>);
                    }
                    return days;
                  })()}
                </select>
              </label>
            </div>
            <div>
              <label>Date & Time
                <DatePicker
                  selected={activity.dateTime}
                  onChange={date => {
                    handleActivityDateChange(date);
                    // Auto-calculate day number
                    if (trip.startDate && date) {
                      const dayNum = Math.floor((date - trip.startDate) / (1000 * 60 * 60 * 24)) + 1;
                      setActivity(prev => ({ ...prev, day: dayNum > 0 ? `Day ${dayNum}` : '' }));
                    }
                  }}
                  showTimeSelect
                  timeFormat="hh:mm aa"
                  timeIntervals={30}
                  dateFormat="MM/dd/yyyy, h:mm aa"
                  placeholderText="Select date & time"
                  className="create-itinerary-datepicker"
                  aria-label="Date & Time"
                  required
                  minDate={trip.startDate}
                  maxDate={trip.endDate}
                />
              </label>
            </div>
            <div>
              <label>Activity
                <input name="activity" aria-label="Activity" value={activity.activity} onChange={handleActivityChange} placeholder="e.g. Rafting" />
              </label>
            </div>
            <div>
              <label>Mode of Transport
                <input name="transport" aria-label="Mode of Transport" value={activity.transport} onChange={handleActivityChange} placeholder="e.g. Train" />
              </label>
            </div>
            <div>
              <label>Location
                <input name="location" aria-label="Location" value={activity.location} onChange={handleActivityChange} placeholder="e.g. Dandeli" />
              </label>
            </div>
            <div>
              <label>Stay
                <input name="stay" aria-label="Stay" value={activity.stay} onChange={handleActivityChange} placeholder="e.g. Hotel Name, Airbnb, etc." />
              </label>
            </div>
            <button type="button" className="create-itinerary-btn-add" onClick={handleAddActivity} disabled={!isActivityValid}>{editingActivityIdx !== null ? 'Update Activity' : '+ Add Activity'}</button>
          </div>
          {activityError && <div style={{ color: 'red', marginBottom: 8 }}>{activityError}</div>}
          <div className="create-itinerary-activity-list">
            {activities.length === 0 && <div style={{ color: '#888' }}>No activities added yet.</div>}
            {activities.map((a, idx) => (
              <li key={idx} style={{listStyle:'none',margin:'18px 0',padding:0}}>
                <div style={{background:'#f9f9ff',borderRadius:10,padding:'18px 20px',boxShadow:'0 2px 8px #8b5cf611',display:'flex',flexDirection:'column',gap:8}}>
                  <div><span className="create-itinerary-activity-label">Activity:</span> {a.activity}</div>
                  <div><span className="create-itinerary-activity-label">Date & Time:</span> {a.dateTime ? format(a.dateTime, 'MM/dd/yyyy, h:mm aa') : ''}</div>
                  <div><span className="create-itinerary-activity-label">Mode of Transport:</span> {a.transport}</div>
                  <div><span className="create-itinerary-activity-label">Location:</span> {a.location}</div>
                  <div><span className="create-itinerary-activity-label">Stay:</span> {a.stay}</div>
                  <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:8}}>
                    <button type="button" className="create-itinerary-btn-secondary edit" onClick={() => handleEditActivity(idx)}>Edit</button>
                    <button type="button" className="create-itinerary-btn-secondary delete" onClick={() => handleDeleteActivity(idx)}>Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </div>
          <div className="create-itinerary-btn-group">
            <button type="button" className="create-itinerary-btn-secondary" onClick={handleBack}>Back</button>
            <button type="submit" className="create-itinerary-btn-main" disabled={saving}>{saving ? 'Saving...' : 'Create Trip'}</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateItinerary; 