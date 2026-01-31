import React from "react";
import "../styles/header.css";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const Header = ({ title = "" }) => {
  const { user, logout } = useAuth();

  return (
    <header className="projects-header">
      <div className="header-left">{title}</div>

      <div className="header-right">
        <span className="user-name">{user?.name || user?.email}</span>

        <Button type="text" icon={<LogoutOutlined />} onClick={logout}>
          <span className="logout-text">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
