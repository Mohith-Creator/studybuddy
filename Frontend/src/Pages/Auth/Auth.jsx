import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Auth.css";

const Auth = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setIsRightPanelActive(false);
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinData),
      });

      const data = await res.json();
      if (res.ok) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user)); // Save user object
        navigate("/home", { state: { user: data.user } }); // Pass user object to the next page
      } else {
        alert(data.message || "Signin failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="wrapper">
      <div
        className={`container ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
        id="container"
      >
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Name"
              value={signupData.name}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />
            <button className="signup" type="submit">
              Sign Up
            </button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleSignin}>
            <h1>Sign in</h1>
            <input
              type="email"
              placeholder="Email"
              value={signinData.email}
              onChange={(e) =>
                setSigninData({ ...signinData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={signinData.password}
              onChange={(e) =>
                setSigninData({ ...signinData, password: e.target.value })
              }
            />
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => setIsRightPanelActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="ghost"
                id="signUp"
                onClick={() => setIsRightPanelActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
