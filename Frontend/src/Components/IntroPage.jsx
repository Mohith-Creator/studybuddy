import React, { useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import "./IntroPage.css";
import downArrowAnimation from "../assets/down-arrow.json"; // Put your Lottie JSON file here

function IntroPage({ onClick }) {
  // Function to handle keydown events (spacebar and enter)
  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      onClick(); // Trigger the onClick function (to navigate to the next page)
    }
  };

  // Adding the keydown event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="intro-container" onClick={onClick}>
      <div className="intro-content">
        <h1 className="logo-text">Welcome, To Student Connect</h1>
        <p className="tagline">Let's make the way of study more efficient</p>
      </div>
      <div className="down-arrow">
        <Player
          autoplay
          loop
          src={downArrowAnimation}
          style={{ height: "60px", width: "60px" }}
        />
      </div>
    </div>
  );
}

export default IntroPage;
