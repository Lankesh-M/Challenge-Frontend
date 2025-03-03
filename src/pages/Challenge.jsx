
// pages/Challenge.jsx
import React, { useState, useEffect } from 'react';
import FriendsList from '../components/FriendsList';

function Challenge({ user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Once');
  const [target, setTarget] = useState(100);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [scope, setScope] = useState('Public');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Set default dates (today and 7 days from now)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    setStartDate(formatDate(today));
    setEndDate(formatDate(today));
    
    // Fetch all users to show as friends
    fetchUsers();
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3010/get-users');
      const data = await response.json();
      
      if (data.allUsers) {
        setUsers(data.allUsers);
      }
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const toggleFriendSelection = (friendId) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3010/createChallenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createdBy: user._id,
          title,
          description,
          type,
          target: parseInt(target),
          startDate,
          endDate,
          scope,
          participants: [user._id, ...selectedFriends],
        }),
      });

      if (response.ok) {
        // Reset form after successful creation
        setTitle('');
        setDescription('');
        setType('Once');
        setTarget(100);
        setScope('Private');
        setSelectedFriends([]);
        
        alert('Challenge created successfully!');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create challenge');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="challenge-page">
      <h1>Create New Challenge</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="challenge-creation">
        <form onSubmit={handleSubmit} className="challenge-form">
          <div className="form-group">
            <label htmlFor="title">Challenge Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Once">Once</option>
                <option value="Track">Track</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="target">Target (number) </label>
              <input
                type="number"
                id="target"
                min="1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="scope">Scope</label>
            <select
              id="scope"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          
          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Challenge'}
          </button>
        </form>
        
        <div className="friends-selection">
          <h3>Invite Friends</h3>
          <p>Selected: {selectedFriends.length} friends</p>
          
          <div className="selected-friends">
            {selectedFriends.length > 0 && (
              <ul>
                {selectedFriends.map(friendId => {
                  const friend = users.find(u => u._id === friendId);
                  return friend ? (
                    <li key={friendId}>
                      {friend.name}
                      <button 
                        className="remove-friend" 
                        onClick={() => toggleFriendSelection(friendId)}
                      >
                        ×
                      </button>
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </div>
          
          <FriendsList 
            users={users}
            currentUserId={user._id}
            onSelect={toggleFriendSelection}
          />
        </div>
      </div>
    </div>
  );
}

export default Challenge;
