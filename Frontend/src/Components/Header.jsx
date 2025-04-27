import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Student");

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the /profile route when the profile image is clicked
  };
  useEffect(() => {
    // Fetch user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setName(user.name);
    }
  }, []);

  return (
    <div
      style={{
        background: "#fff",
        color: "#1a1a1a",
        padding: "10px 20px",
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: "sans-serif",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #ccc",
        position: "fixed",
        top: 0,
        left: "250px",
        right: 0,
        height: "70px",
        zIndex: 1001,
      }}
    >
      <div>Welcome, {name}!</div>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <img
          src="https://randomuser.me/api/portraits/men/75.jpg"
          alt="User Avatar"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={handleProfileClick} // Attach the click handler to the profile image
        />
      </div>
    </div>
  );
};

export default Header;
