import { NavLink } from "react-router-dom";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/home" className="logo">
        Student Connect
      </NavLink>
      <nav className="nav-menu">
        <NavItem to="/home" icon={<Home size={20} />} label="Home" />
        <NavItem to="/discover" icon={<Search size={20} />} label="Discover" />
        <NavItem to="/post" icon={<Plus size={20} />} label="Post" />
        {/* Update the Chat link to navigate to /chat/connection-requests */}
        <NavItem
          to="/chat/connection-requests"
          icon={<MessageCircle size={20} />}
          label="Chat"
        />
        <NavItem to="/profile" icon={<User size={20} />} label="Profile" />
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
  >
    <span className="icon">{icon}</span>
    <span className="label">{label}</span>
  </NavLink>
);

export default Sidebar;
