
// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import ChallengeCard from '../components/ChallengeCard';

function Home({ user }) {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('http://localhost:3010/get-challenges');
      const data = await response.json();
      
      if (data.allChallenges) {
        setChallenges(data.allChallenges);
      }
    } catch (err) {
      setError('Failed to fetch challenges');
    } finally {
      setIsLoading(false);
    }
  };

  const joinChallenge = async (challengeId) => {
    try {
      const response = await fetch('http://localhost:3010/user/join-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          challengeId,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update user in local storage
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload(); // Refresh to see updated data
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to join challenge');
    }
  };

  const updateProgress = async (challengeId, progressToAdd) => {
    try {
      const response = await fetch('http://localhost:3010/user/update-progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          challengeId,
          progressToAdd,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update user in local storage
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload(); // Refresh to see updated data
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to update progress');
    }
  };

  // Separate challenges into current and completed
  const currentChallenges = [];
  const completedChallenges = [];
  
  if (user && user.challengesIn && challenges.length) {
    challenges.forEach(challenge => {
      const userProgress = user.challengesIn.find(c => c.challengeId === challenge._id);
      
      if (userProgress) {
        if (userProgress.completed) {
          completedChallenges.push({ challenge, userProgress });
        } else {
          currentChallenges.push({ challenge, userProgress });
        }
      }
    });
  }

  // Get challenges not joined yet
  const availableChallenges = challenges.filter(challenge => 
    !user.challengesIn.some(c => c.challengeId === challenge._id)
  );

  return (
    <div className="home-page">
      <h1>Dashboard</h1>
      
      {isLoading ? (
        <div className="loading">Loading challenges...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="dashboard-content">
          <section className="current-challenges">
            <h2>Current Challenges</h2>
            {currentChallenges.length === 0 ? (
              <p>You have no active challenges.</p>
            ) : (
              <div className="challenges-grid">
                {currentChallenges.map(({ challenge, userProgress }) => (
                  <ChallengeCard 
                    key={challenge._id}
                    challenge={challenge}
                    userProgress={userProgress}
                    onUpdateProgress={updateProgress}
                  />
                ))}
              </div>
            )}
          </section>
          
          <section className="completed-challenges">
            <h2>Completed Challenges</h2>
            {completedChallenges.length === 0 ? (
              <p>You haven't completed any challenges yet.</p>
            ) : (
              <div className="challenges-grid">
                {completedChallenges.map(({ challenge, userProgress }) => (
                  <ChallengeCard 
                    key={challenge._id}
                    challenge={challenge}
                    userProgress={userProgress}
                  />
                ))}
              </div>
            )}
          </section>
          
          <section className="available-challenges">
            <h2>Available Challenges</h2>
            {availableChallenges.length === 0 ? (
              <p>No available challenges found.</p>
            ) : (
              <div className="challenges-grid">
                {availableChallenges.map(challenge => (
                  <ChallengeCard 
                    key={challenge._id}
                    challenge={challenge}
                    onJoin={joinChallenge}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default Home;
