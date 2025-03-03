
// components/FriendsList.jsx
import React from 'react';

function FriendsList({ users, currentUserId, onSelect }) {
  // Filter out current user from the list
  const friends = users.filter(user => user._id !== currentUserId);

  return (
    <div className="friends-list">
      <h3>Friends</h3>
      {friends.length === 0 ? (
        <p>No friends found</p>
      ) : (
        <ul>
          {friends.map(friend => (
            <li key={friend._id} onClick={() => onSelect(friend._id)}>
              <span className="friend-name">{friend.name}</span>
              <span className="friend-email">{friend.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FriendsList;
