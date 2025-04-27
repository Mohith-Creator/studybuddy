import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      {/* Sidebar */}
      <div
        style={{
          width: "200px",
          background: "#f1f1f1",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1000, // Sidebar above header
        }}
      >
        <Sidebar />
      </div>

      {/* Header */}
      <div>
        <Header />
      </div>

      {/* Page content */}
      <div
        style={{
          marginLeft: "200px",
          marginTop: "60px",
          padding: "20px",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
