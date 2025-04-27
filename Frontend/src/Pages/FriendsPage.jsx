import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat"; // Import Chat component
import "./FriendsPage.css";

function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const loggedInUserEmail = JSON.parse(localStorage.getItem("user"))?.email;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/connections/${loggedInUserEmail}`);
        const data = await res.json();

        if (res.ok) {
          const connectedFriends = data.connections
            .filter((conn) => conn.status === "connected")
            .map((conn) =>
              conn.email_user1.email === loggedInUserEmail ? conn.email_user2 : conn.email_user1
            );
          setFriends(connectedFriends);
        } else {
          alert(data.message || "Failed to fetch friends");
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
        alert("Something went wrong");
      }
    };

    fetchFriends();
  }, [loggedInUserEmail]);

  return (
    <div>
      <Chat /> {/* Include Chat component */}
      <div className="friends-section">
        <h2>Your Friends</h2>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <div
              key={index}
              className="friend-item"
              onClick={() => navigate(`/user/${friend.email}`)}
            >
              <img
                src={friend.profilePhotoUrl || "https://via.placeholder.com/150"}
                alt={friend.name || "Unknown User"}
                className="avatar"
              />
              <div>
                <h3>{friend.name || friend.email}</h3>
              </div>
            </div>
          ))
        ) : (
          <p>No friends found.</p>
        )}
      </div>
    </div>
  );
}

export default FriendsPage;