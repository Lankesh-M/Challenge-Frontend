
// pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';

function Profile({ user }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChallenges: 0,
    completedChallenges: 0,
    ongoingChallenges: 0,
    completionRate: 0,
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('https://challenge-backend-4yo4.onrender.com/get-challenges');
      const data = await response.json();
      
      if (data.allChallenges) {
        setChallenges(data.allChallenges);
        calculateStats(data.allChallenges);
      }
    } catch (err) {
      console.error('Failed to fetch challenges', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allChallenges) => {
    if (!user.challengesIn) return;
    
    const userChallenges = user.challengesIn;
    const completedChallenges = userChallenges.filter(c => c.completed).length;
    const totalChallenges = userChallenges.length;
    const ongoingChallenges = totalChallenges - completedChallenges;
    const completionRate = totalChallenges > 0 
      ? Math.round((completedChallenges / totalChallenges) * 100) 
      : 0;
    
    setStats({
      totalChallenges,
      completedChallenges,
      ongoingChallenges,
      completionRate,
    });
  };

  // Get user challenge details
  const getUserChallenges = () => {
    if (!user.challengesIn || challenges.length === 0) return [];
    
    return user.challengesIn.map(userChallenge => {
      const challengeDetails = challenges.find(
        c => c._id === userChallenge.challengeId
      );
      
      if (challengeDetails) {
        return {
          ...challengeDetails,
          progress: userChallenge.progress,
          completed: userChallenge.completed,
          joinedAt: userChallenge.createdAt,
          updatedAt: userChallenge.updatedAt,
        };
      }
      return null;
    }).filter(c => c !== null);
  };

  const userChallenges = getUserChallenges();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <div className="user-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading profile data...</div>
      ) : (
        <div className="profile-content">
          <div className="stats-section">
            <h3>Challenge Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">{stats.totalChallenges}</span>
                <span className="stat-label">Total Challenges</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.completedChallenges}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.ongoingChallenges}</span>
                <span className="stat-label">Ongoing</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.completionRate}%</span>
                <span className="stat-label">Completion Rate</span>
              </div>
            </div>
          </div>
          
          <div className="challenge-history">
            <h3>Challenge History</h3>
            {userChallenges.length === 0 ? (
              <p>You haven't joined any challenges yet.</p>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Challenge</th>
                    <th>Type</th>
                    <th>Target</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userChallenges.map(challenge => {
                    const progressPercent = Math.round((challenge.progress / challenge.target) * 100);
                    
                    return (
                      <tr key={challenge._id}>
                        <td>{challenge.title}</td>
                        <td>{challenge.type}</td>
                        <td>{challenge.target}</td>
                        <td>
                          <div className="table-progress">
                            <span>{challenge.progress} / {challenge.target}</span>
                            <ProgressBar percent={progressPercent} />
                          </div>
                        </td>
                        <td>
                          <span className={`status ${challenge.completed ? 'completed' : 'ongoing'}`}>
                            {challenge.completed ? 'Completed' : 'Ongoing'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
