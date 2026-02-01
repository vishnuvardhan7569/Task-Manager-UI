import { Link } from "react-router-dom";
import "../styles/header.css";
import { Button } from "antd";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const Header = ({ title = "" }) => {
  const { user, logout } = useAuth();

  return (
    <header className="projects-header">
      <Link to="/" className="header-left">{title}</Link>

      <div className="header-right">
        <Link to="/settings" className="settings-link">
          <Button type="text" icon={<SettingOutlined />}>
            <span className="settings-text">Settings</span>
          </Button>
        </Link>

        <span className="user-name">{user?.name || user?.email}</span>

        <Button type="text" icon={<LogoutOutlined />} onClick={logout}>
          <span className="logout-text">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
