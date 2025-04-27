import React from "react";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

function Chat() {
  const navigate = useNavigate();

  return (
    <div className="chat-container">
      {/* Section Tabs */}
      <div className="section-tabs">
        <button className="tab-btn" onClick={() => navigate("/chat/friends")}>
          Friends
        </button>
        <button className="tab-btn" onClick={() => navigate("/chat/connection-requests")}>
          Connection Requests
        </button>
        <button className="tab-btn" onClick={() => navigate("/chat/chats")}>
          Chats
        </button>
      </div>
    </div>
  );
}

export default Chat;
