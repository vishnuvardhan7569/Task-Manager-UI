import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "antd";
import { CheckCircleOutlined, RocketOutlined, BankOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

const Feature = ({ icon, title, desc }) => (
  <Card className="feature-card" variant="plain">
    <div className="feature-icon">{icon}</div>
    <h4>{title}</h4>
    <p className="feature-desc">{desc}</p>
  </Card>
);

const Home = () => {
  const { isAuthenticated } = useAuth();
  // removed preview state
  const [ignored] = useState(null);

  return (
    <>
      <Header title={"Task Manager"} />

      <main className="home-main pro">
        <div className="container">
          <section className="home-hero pro-hero">
            <div className="hero-left">
              <h1 className="hero-title">Focus on work that matters</h1>
              <p className="hero-sub">Plan, track and manage your team's projects with confidence. Built for speed, clarity and collaboration.</p>

              <div className="hero-cta">
                {isAuthenticated ? (
                  <>
                    <Link to="/projects">
                      <Button type="primary" size="large">Open Projects</Button>
                    </Link>
                    <span className="hero-spacer" />
                    <Link to="/projects">
                      <Button>New Project</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button type="primary" size="large">Get Started — Free</Button>
                    </Link>
                    <span className="hero-spacer" />
                    <Link to="/login">
                      <Button>Log in</Button>
                    </Link>
                  </>
                )}
              </div>

              <div className="benefits">
                <Feature icon={<RocketOutlined />} title="Fast setup" desc="Create projects and tasks in seconds." />
                <Feature icon={<CheckCircleOutlined />} title="Clear progress" desc="Track completed tasks and progress at a glance." />
                <Feature icon={<BankOutlined />} title="Secure" desc="JWT authentication and scoped access." />
              </div>

          </div>
        </section>
        </div>

        <section className="home-info pro-info">
          <div className="container info-inner">
            <div>
              <h3>Why teams choose Task Manager</h3>
              <p className="lead">Designed for small teams and solo builders who need a reliable way to deliver work. Minimal setup, maximum clarity.</p>
            </div>

            <div className="info-cta">
              <Link to="/signup"><Button type="primary">Create an account</Button></Link>
              <Link to="/projects"><Button type="text">View projects</Button></Link>
            </div>
          </div>
        </section>

        <footer className="home-footer">
          <div className="footer-center">© 2026 Task Manager</div>
        </footer>
      </main>
    </>
  );
};

export default Home;
