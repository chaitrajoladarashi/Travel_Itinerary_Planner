import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const tripsData = JSON.parse(localStorage.getItem('trips') || '[]');
    setTrips(tripsData);
  }, []);

  const handleDelete = (idx) => {
    const tripsData = JSON.parse(localStorage.getItem('trips') || '[]');
    tripsData.splice(idx, 1);
    localStorage.setItem('trips', JSON.stringify(tripsData));
    setTrips(tripsData);
  };

  const handleUpdate = (idx) => {
    const tripsData = JSON.parse(localStorage.getItem('trips') || '[]');
    localStorage.setItem('editTrip', JSON.stringify({ ...tripsData[idx], idx }));
    window.location.href = '/create-itinerary';
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome</h2>
      <div className="dashboard-header">
        <button className="btn gradient" onClick={() => window.location.href = '/create-itinerary'}>Create Trip</button>
      </div>
      <div className="trips-list">
        <h3>All Trips</h3>
        {trips.length === 0 ? (
          <div>No trips yet. Click 'Create Trip' to add your first trip!</div>
        ) : (
          trips.map((trip, idx) => (
            <div className="trip-card" key={idx}>
              <div className="trip-title" style={{color:'#6c63ff', fontWeight:'bold', fontSize:'1.2rem'}}>{trip.tripName || `Trip ${idx + 1}`}</div>
              <div className="trip-details">
                <span><b>From:</b> {trip.startPlace}</span>
                <span><b>To:</b> {trip.endPlace}</span>
                <span><b>Start:</b> {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : ''}</span>
                <span><b>End:</b> {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : ''}</span>
              </div>
              <div className="trip-description"><b>Description:</b> {trip.description}</div>
              <div className="trip-activities">
                <b>Activities:</b>
                {trip.activities && trip.activities.length > 0 ? (
                  <ul>
                    {trip.activities.map((act, i) => (
                      <li key={i} style={{marginBottom: '0.7rem'}}>
                        <div><b>Day:</b> {act.day}</div>
                        <div><b>Activity:</b> {act.name}</div>
                        <div><b>Date & Time:</b> {act.datetime ? new Date(act.datetime).toLocaleString() : ''}</div>
                        <div><b>Mode of Transport:</b> {act.transport || '-'}</div>
                        <div><b>Location:</b> {act.location || '-'}</div>
                        <div><b>Stay:</b> {act.stay || '-'}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>No activities planned.</div>
                )}
              </div>
              <div className="trip-actions">
                <button className="btn edit" onClick={() => handleUpdate(idx)}>Update</button>
                <button className="btn delete" onClick={() => handleDelete(idx)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard; 