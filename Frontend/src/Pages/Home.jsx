import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { Search } from "lucide-react";
import "./Home.css";

const categories = [
  { name: "study", color: "study" },
  { name: "guide", color: "guide" },
  { name: "collaborator", color: "collaborator" },
  { name: "internship", color: "internship" },
];

function Home() {
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState([]); // State to store existing connections
  const [searchQuery, setSearchQuery] = useState("");
  const userEmail = JSON.parse(localStorage.getItem("user"))?.email; // Get logged-in user's email

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/posts");
        const data = await res.json();

        if (res.ok) {
          // Filter out posts created by the logged-in user
          const filteredPosts = data.posts.filter(
            (post) => post.email !== userEmail
          );
          setPosts(filteredPosts);
        } else {
          alert(data.message || "Failed to fetch posts");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        alert("Something went wrong");
      }
    };

    fetchPosts();
  }, [userEmail]);

  // Fetch existing connections
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/connections/${userEmail}`
        );
        const data = await res.json();

        if (res.ok) {
          setConnections(data.connections); // Store existing connections
        } else {
          alert(data.message || "Failed to fetch connections");
        }
      } catch (err) {
        console.error("Error fetching connections:", err);
        alert("Something went wrong");
      }
    };

    fetchConnections();
  }, [userEmail]);

  // Check connection status
  const getConnectionStatus = (postEmail) => {
    const connection = connections.find(
      (conn) =>
        (conn.email_user1.email === userEmail &&
          conn.email_user2.email === postEmail) ||
        (conn.email_user1.email === postEmail &&
          conn.email_user2.email === userEmail)
    );

    console.log("Connection status:", connection?.status); // Debugging log
    if (!connection) return "none"; // No connection exists
    if (connection.status === "pending") {
      if (connection.email_user1.email === userEmail) return "sent"; // Connection request sent by logged-in user
      if (connection.email_user2.email === userEmail) return "received"; // Connection request received by logged-in user
    }
    if (connection.status === "connected") return "connected"; // Connection accepted
    return "none";
  };

  // Handle Connect Button Click
  const handleConnect = async (postEmail) => {
    try {
      const res = await fetch("http://localhost:5000/api/connections/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_user1: userEmail, // Logged-in user's email
          email_user2: postEmail, // Post owner's email
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Connection request sent successfully!");
        setConnections((prev) => [
          ...prev,
          { email_user1: userEmail, email_user2: postEmail, status: "pending" },
        ]); // Update connections state
      } else {
        alert(data.message || "Failed to send connection request");
      }
    } catch (err) {
      console.error("Error sending connection request:", err);
      alert("Something went wrong");
    }
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="search-section">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search posts..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="category-list">
        {categories.map((category) => (
          <section key={category.name}>
            <div className="category-header">
              <h3 className="category-title">{category.name}</h3>
              <span className={`category-count ${category.color}`}>
                {
                  filteredPosts.filter(
                    (post) => post.postType === category.name
                  ).length
                }{" "}
                posts
              </span>
            </div>

            <div className="post-list">
              {filteredPosts
                .filter((post) => post.postType === category.name)
                .map((post) => (
                  <Link
                    to={`/user/${post.email}`} // Navigate to UserProfile.jsx with the user's email
                    key={post._id}
                    className="post-card"
                  >
                    <div className="post-user">
                      <img
                        src={
                          post.userImage || "https://via.placeholder.com/150"
                        }
                        alt={post.userName || "Unknown User"}
                        className="user-image"
                      />
                      <div className="user-info">
                        <h4 className="user-name">
                          {post.userName || "Unknown User"}
                        </h4>
                        <p className="user-meta">
                          {post.college || "Unknown College"} •{" "}
                          {post.year || "N/A"}
                        </p>
                      </div>
                    </div>
                    <p className="post-content">{post.content}</p>
                    <div className="skill-tags">
                      {post.skills.map((skill) => (
                        <span key={skill} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="buttons">
                      {getConnectionStatus(post.email) === "none" && (
                        <button
                          className="connect-button"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent navigation when clicking "Connect"
                            handleConnect(post.email);
                          }}
                        >
                          Connect
                        </button>
                      )}
                      {getConnectionStatus(post.email) === "sent" && (
                        <button className="connect-button" disabled>
                          Sent
                        </button>
                      )}
                      {getConnectionStatus(post.email) === "received" && (
                        <button className="connect-button" disabled>
                          Received
                        </button>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default Home;
