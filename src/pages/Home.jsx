import { Link } from "react-router-dom";
import { Button, Card } from "antd";
import { CheckCircleOutlined, RocketOutlined, BankOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

const Feature = ({ icon, title, description }) => (
  <Card className="feature-card" variant="plain">
    <div className="feature-icon">{icon}</div>
    <h4>{title}</h4>
    <p className="feature-desc">{description}</p>
  </Card>
);

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header title={"Task Manager"} />

      <main className="home-main pro">
        <div className="container">
          <section className="home-hero pro-hero">
            <div className="hero-left">
              <h1 className="hero-title">Manage All Your Projects and Tasks at One Place</h1>
              <p className="hero-sub">Plan, track and manage your projects with confidence.</p>

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
                <Feature icon={<RocketOutlined />} title="Fast setup" description="Create projects and tasks in seconds." />
                <Feature icon={<CheckCircleOutlined />} title="Clear progress" description="Track completed tasks and progress at a glance." />
                <Feature icon={<BankOutlined />} title="Secure" description="JWT authentication and scoped access." />
              </div>
            </div>
          </section>
        </div>

        <footer className="home-footer">
          <div className="footer-center">© 2026 Task Manager</div>
        </footer>
      </main>
    </>
  );
};

export default Home;
