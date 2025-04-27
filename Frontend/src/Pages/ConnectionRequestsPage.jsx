import React, { useEffect, useState } from "react";
import Chat from "./Chat"; // Import Chat component
import "./ConnectionRequestsPage.css";

function ConnectionRequestsPage() {
  const [connectionRequests, setConnectionRequests] = useState([]);
  const loggedInUserEmail = JSON.parse(localStorage.getItem("user"))?.email;

  useEffect(() => {
    const fetchConnectionRequests = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/connections/requests/${loggedInUserEmail}`
        );
        const data = await res.json();

        if (res.ok) {
          setConnectionRequests(data.requests);
        } else {
          alert(data.message || "Failed to fetch connection requests");
        }
      } catch (err) {
        console.error("Error fetching connection requests:", err);
        alert("Something went wrong");
      }
    };

    fetchConnectionRequests();
  }, [loggedInUserEmail]);

  const handleAccept = async (email_user1) => {
    try {
      const res = await fetch("http://localhost:5000/api/connections/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_user1, email_user2: loggedInUserEmail }),
      });

      if (res.ok) {
        alert("Connection request accepted!");
        setConnectionRequests((prev) =>
          prev.filter((request) => request.email_user1.email !== email_user1)
        );
      } else {
        alert("Failed to accept connection request");
      }
    } catch (err) {
      console.error("Error accepting connection request:", err);
      alert("Something went wrong");
    }
  };

  const handleReject = async (email_user1) => {
    try {
      const res = await fetch("http://localhost:5000/api/connections/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_user1, email_user2: loggedInUserEmail }),
      });

      if (res.ok) {
        alert("Connection request rejected!");
        setConnectionRequests((prev) =>
          prev.filter((request) => request.email_user1.email !== email_user1)
        );
      } else {
        alert("Failed to reject connection request");
      }
    } catch (err) {
      console.error("Error rejecting connection request:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <Chat /> {/* Include Chat component */}
      <div className="requests-section">
        <h2>Connection Requests</h2>
        {connectionRequests.length > 0 ? (
          connectionRequests.map((request) => (
            <div key={request._id} className="request-item">
              <img
                src={
                  request.email_user1.profilePhotoUrl ||
                  "https://via.placeholder.com/150"
                }
                alt={request.email_user1.name || "Unknown User"}
                className="avatar"
              />
              <div>
                <h3>{request.email_user1.name || request.email_user1.email}</h3>
                <p>Sent you a connection request</p>
              </div>
              <div>
                <button onClick={() => handleAccept(request.email_user1.email)}>
                  Accept
                </button>
                <button onClick={() => handleReject(request.email_user1.email)}>
                  Decline
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No connection requests found.</p>
        )}
      </div>
    </div>
  );
}

export default ConnectionRequestsPage;
