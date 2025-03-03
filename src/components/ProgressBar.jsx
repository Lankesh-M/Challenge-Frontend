
// components/ProgressBar.jsx
import React from 'react';

function ProgressBar({ percent }) {
  return (
    <div className="progress-container">
      <div 
        className="progress-bar" 
        style={{ width: `${percent}%` }}
      >
        <span className="progress-text">{percent}%</span>
      </div>
    </div>
  );
}

export default ProgressBar;
