import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";

import IntroWrapper from "./Components/IntroWrapper";
import Auth from "./Pages/Auth/Auth";
import Home from "./Pages/Home";
import Discover from "./Pages/Discover";
import Chat from "./Pages/Chat"; // Chat navigation hub
import FriendsPage from "./Pages/FriendsPage"; // Friends Page
import ConnectionRequestsPage from "./Pages/ConnectionRequestsPage"; // Connection Requests Page
import ChatsPage from "./Pages/ChatsPage"; // Chats Page
import ChatWindow from "./Pages/ChatWindow"; // Chat Window for individual chats
import Profile from "./Pages/Profile";
import Post from "./Pages/Post";
import UserProfile from "./Pages/UserProfile"; // User Profile Page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroWrapper />} />
        {/* Auth route without layout */}
        <Route path="/auth" element={<Auth />} />

        {/* Routes that use sidebar + header layout */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          {/* Chat Routes */}
          <Route path="/chat" element={<Chat />} /> {/* Chat navigation hub */}
          <Route path="/chat/friends" element={<FriendsPage />} />{" "}
          {/* Friends Page */}
          <Route
            path="/chat/connection-requests"
            element={<ConnectionRequestsPage />}
          />{" "}
          {/* Connection Requests */}
          <Route path="/chat/chats" element={<ChatsPage />} />{" "}
          {/* Chats Page */}
          <Route path="/chat/:email" element={<ChatWindow />} />{" "}
          {/* Chat Window for individual chats */}
          {/* Other Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/post" element={<Post />} />
          <Route path="/user/:email" element={<UserProfile />} />{" "}
          {/* User Profile */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
