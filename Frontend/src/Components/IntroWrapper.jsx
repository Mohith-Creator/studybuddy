import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IntroPage from "./IntroPage";
import FeaturesPage from "./FeaturesPage";
import "./IntroWrapper.css";

function IntroWrapper() {
  const [showIntro, setShowIntro] = useState(true);
  const [showFeatures, setShowFeatures] = useState(false);
  const navigate = useNavigate();

  const handleIntroClick = () => {
    setShowIntro(false);
    setTimeout(() => setShowFeatures(true), 500); // Delay for smooth transition
  };

  const handleFeaturesComplete = () => {
    navigate("/auth"); // Navigate to authentication page
  };

  return (
    <div className="intro-wrapper">
      {showIntro && <IntroPage onClick={handleIntroClick} />}
      {showFeatures && <FeaturesPage onComplete={handleFeaturesComplete} />}
    </div>
  );
}

export default IntroWrapper;
