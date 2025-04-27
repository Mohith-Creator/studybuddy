import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Discover.css";
import { FaSearch } from "react-icons/fa";

const Discover = () => {
  const [users, setUsers] = useState([]); // State to store users
  const [connections, setConnections] = useState([]); // State to store existing connections
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const loggedInUserEmail = JSON.parse(localStorage.getItem("user"))?.email; // Get logged-in user's email

  // Fetch users from the backend
  useEffect(() => {
    const fetchConnectionsAndUsers = async () => {
      try {
        // Fetch connections
        const connectionsRes = await fetch(`http://localhost:5000/api/connections/${loggedInUserEmail}`);
        const connectionsData = await connectionsRes.json();

        if (connectionsRes.ok) {
          setConnections(connectionsData.connections); // Store connections
        } else {
          alert(connectionsData.message || "Failed to fetch connections");
        }

        // Fetch users
        const usersRes = await fetch(`http://localhost:5000/api/users?email=${loggedInUserEmail}`);
        const usersData = await usersRes.json();

        if (usersRes.ok) {
          setUsers(usersData.users); // Store users
        } else {
          alert(usersData.message || "Failed to fetch users");
        }
      } catch (err) {
        console.error("Error fetching connections or users:", err);
        alert("Something went wrong");
      }
    };

    fetchConnectionsAndUsers();
  }, [loggedInUserEmail]); // Re-fetch connections and users when the logged-in user's email changes

  // Check connection status
  const getConnectionStatus = (userEmail) => {
    const connection = connections.find(
      (conn) =>
        (conn.email_user1.email === loggedInUserEmail && conn.email_user2.email === userEmail) ||
        (conn.email_user1.email === userEmail && conn.email_user2.email === loggedInUserEmail)
    );

    if (!connection) return "none"; // No connection exists
    if (connection.status === "pending") {
      if (connection.email_user1.email === loggedInUserEmail) return "sent"; // Connection request sent by logged-in user
      if (connection.email_user2.email === loggedInUserEmail) return "received"; // Connection request received by logged-in user
    }
    if (connection.status === "connected") return "connected"; // Connection accepted
    return "none";
  };

  // Handle Connect Button Click
  const handleConnect = async (userEmail) => {
    const loggedInUserEmail = JSON.parse(localStorage.getItem("user"))?.email; // Ensure this is defined

    if (!loggedInUserEmail) {
      alert("User not logged in");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/connections/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_user1: loggedInUserEmail, // Logged-in user's email
          email_user2: userEmail, // Selected user's email
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Connection request sent successfully!");

        // Update the connections state immediately
        setConnections((prevConnections) => [
          ...prevConnections,
          {
            email_user1: { email: loggedInUserEmail }, // Match the structure of existing connections
            email_user2: { email: userEmail },
            status: "pending",
          },
        ]);
      } else {
        alert(data.message || "Failed to send connection request");
      }
    } catch (err) {
      console.error("Error sending connection request:", err);
      alert("Something went wrong");
    }
  };

  // Filter users based on the search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.knownSkills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="discover-container">
      <h2>Discover Students</h2>

      {/* Search with icon */}
      <div className="search-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-box"
          placeholder="Search by name or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="card-container">
        {filteredUsers.map((user, idx) => (
          <div key={idx} className="student-card">
            <img
              src={user.profilePhotoUrl || "https://via.placeholder.com/150"}
              alt={user.name}
              className="avatar"
            />
            <div className="card-info">
              <h3>{user.name}</h3>
              <p>{user.college || "Unknown College"}</p>
              <p>
                {user.branch || "Unknown Branch"} •{" "}
                {user.year ? `${user.year} Year` : "N/A"}
              </p>
              <div className="skills">
                {user.knownSkills.map((skill, i) => (
                  <span key={i}>{skill}</span>
                ))}
              </div>
              <div className="buttons">
                {getConnectionStatus(user.email) === "none" && (
                  <button
                    className="connect-btn"
                    onClick={() => handleConnect(user.email)}
                  >
                    Connect
                  </button>
                )}
                {getConnectionStatus(user.email) === "sent" && (
                  <button className="connect-btn" disabled>
                    Sent
                  </button>
                )}
                {getConnectionStatus(user.email) === "received" && (
                  <button className="connect-btn" disabled>
                    Received
                  </button>
                )}
                {getConnectionStatus(user.email) === "connected" && (
                  <button className="connect-btn" disabled>
                    Connected
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
