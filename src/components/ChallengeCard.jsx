

// components/ChallengeCard.jsx
import React from 'react';
import ProgressBar from './ProgressBar';

function ChallengeCard({ challenge, userProgress, onJoin, onUpdateProgress }) {
  const startDate = new Date(challenge.startDate).toLocaleDateString();
  const endDate = new Date(challenge.endDate).toLocaleDateString();
  
  const isJoined = userProgress && userProgress.challengeId === challenge._id;
  const progress = isJoined ? userProgress.progress : 0;
  const isCompleted = isJoined && userProgress.status == "Completed";
  
  const percentComplete = Math.round((progress / challenge.target) * 100);

  return (
    <div className="challenge-card">
      <h3>{challenge.title}</h3>
      <p>{challenge.description}</p>
      <div className="challenge-details">
        <span className="challenge-type">Type: {challenge.type}</span>
        <span className="challenge-dates">{startDate} - {endDate}</span>
      </div>
      <div className="challenge-target">
        <span>Target: {progress} / {challenge.target}</span>
        <ProgressBar percent={percentComplete} />
      </div>
      <div className="challenge-actions">
        {!isJoined && (
          <button className="join-btn" onClick={() => onJoin(challenge._id)}>
            Join Challenge
          </button>
        )}
        {isJoined && !isCompleted && (
          <div className="update-progress">
            <input 
              type="number" 
              placeholder="Add progress" 
              min="1" 
              max={challenge.target - progress}
            />
            <button onClick={(e) => {
              const value = parseInt(e.target.previousSibling.value);
              if (value > 0) onUpdateProgress(challenge._id, value);
            }}>
              Update
            </button>
          </div>
        )}
        {isCompleted && (
          <div className="completed-badge">Completed!</div>
        )}
      </div>
    </div>
  );
}

export default ChallengeCard;
