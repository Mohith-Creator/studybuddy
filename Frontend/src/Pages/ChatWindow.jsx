import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Chat from "./Chat"; // Include Chat component
import "./ChatWindow.css"; // Add styles for the chat window

const socket = io("http://localhost:5000"); // Connect to the backend

function ChatWindow() {
  const { email } = useParams(); // Get the friend's email from the route
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const loggedInUserEmail = JSON.parse(localStorage.getItem("user"))?.email;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/messages?user1=${loggedInUserEmail}&user2=${email}`
        );
        const data = await res.json();

        if (res.ok) {
          setMessages(data.messages);
        } else {
          alert(data.message || "Failed to fetch messages");
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        alert("Something went wrong");
      }
    };

    fetchMessages();

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      if (
        (message.sender === loggedInUserEmail && message.receiver === email) ||
        (message.sender === email && message.receiver === loggedInUserEmail)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [email, loggedInUserEmail]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    socket.emit("sendMessage", {
      sender: loggedInUserEmail, // Sender's email
      receiver: email, // Receiver's email
      message: newMessage, // Message content
    });

    setMessages((prev) => [...prev, { sender: loggedInUserEmail, message: newMessage }]);
    setNewMessage(""); // Clear the input box
  };

  return (
    <div>
      <Chat /> {/* Include Chat component */}
      <div className="chat-window">
        <div className="chat-header">
          <h2>Chat with {email}</h2>
        </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === email ? "received" : "sent"}`}
            >
              {msg.message}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;