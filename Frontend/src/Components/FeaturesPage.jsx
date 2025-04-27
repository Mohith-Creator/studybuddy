import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import "./FeaturesPage.css";

import chatAnimation from "../assets/chat.json";
import groupsAnimation from "../assets/group.json";
import discoverPeopleAnimation from "../assets/discover-people.json";
import connectAnimation from "../assets/network.json";
import collaborateAnimation from "../assets/collaborate.json"; // Add animation for "Collaborate on Projects"
import internshipAnimation from "../assets/internship.json"; // Add animation for "Internship Support"
import mentorAnimation from "../assets/mentor.json"; // Add animation for "Find a Guide/Mentor"
import studyPartnerAnimation from "../assets/study-partner.json"; // Add animation for "Study Partner Finder"

const features = [
  {
    name: "Discover New People",
    tagline:
      "Explore profiles based on shared interests, skills, location, or academic background.",
    animation: discoverPeopleAnimation,
  },
  {
    name: "Connect Seamlessly",
    tagline:
      "Build a network of like-minded individuals with easy connection requests and profiles.",
    animation: connectAnimation,
  },
  {
    name: "Real-Time Communication",
    tagline:
      "Chat instantly through text, voice, or video. Join group chats and participate in topic-specific discussion rooms.",
    animation: chatAnimation,
  },
  {
    name: "Find Your Buddy",
    tagline:
      "Smart recommendations to help you match with study buddies, hobby partners, or activity mates.",
    animation: groupsAnimation,
  },
  {
    name: "Collaborate on Projects",
    tagline:
      "Create, join, or manage group projects. Share tasks, documents, and track progress through timelines.",
    animation: collaborateAnimation,
  },
  {
    name: "Internship Support",
    tagline:
      "Connect with peers and mentors to get guidance on internship tasks and projects. Share and discover internship opportunities.",
    animation: internshipAnimation,
  },
  {
    name: "Find a Guide/Mentor",
    tagline:
      "Match with experienced mentors to guide you through your studies, career, or personal projects.",
    animation: mentorAnimation,
  },
  {
    name: "Study Partner Finder",
    tagline:
      "Search for partners studying similar courses or preparing for the same exams. Schedule group study sessions and track collective learning goals.",
    animation: studyPartnerAnimation,
  },
];

function FeaturesPage({ onComplete }) {
  const [index, setIndex] = useState(0);

  // Function to handle the 'Next' button click
  const nextFeature = () => {
    if (index === features.length - 1) {
      onComplete();
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  // Function to handle the 'Previous' button click
  const prevFeature = () => {
    setIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  // Handling keyboard arrow key events
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      nextFeature();
    } else if (e.key === "ArrowLeft") {
      prevFeature();
    }
  };

  // Adding the keydown event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [index]); // Re-run the effect when index changes

  return (
    <div className="features-container">
      <div className="lottie-wrapper">
        <Lottie
          animationData={features[index].animation}
          loop={true}
          style={{ height: 250, width: 250 }}
        />
      </div>
      <h2 className="feature-title">{features[index].name}</h2>
      <p className="feature-tagline">{features[index].tagline}</p>
      <div className="feature-buttons">
        {index !== 0 && <button onClick={prevFeature}>Previous</button>}
        <button onClick={nextFeature}>
          {index === features.length - 1 ? "Start App" : "Next"}
        </button>
      </div>
      <div className="feature-dots">
        {features.map((_, i) => (
          <div
            key={i}
            className={`feature-dot ${i === index ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

export default FeaturesPage;
