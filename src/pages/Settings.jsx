
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Modal, message, Button } from "antd";
import Header from "../components/Header";
import "../styles/settings.css";

const Settings = () => {
  const { user, deleteAccount } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== "delete") {
      message.error('Type "delete" to confirm');
      return;
    }

    setDeleting(true);
    await deleteAccount();
    setDeleting(false);
    setShowDeleteModal(false);
  };

  return (
    <>
      <Header title="Settings" />
      <main className="settings-page">
        <div className="settings-container">
          <div className="settings-toolbar">
            <Button onClick={() => navigate("/")}>Back</Button>
          </div>

          <div className="settings-section">
            <h2>User Information</h2>
            <div className="user-info">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>
          </div>

          <div className="settings-section danger">
            <h2>Delete Account</h2>
            <p>Permanently delete your account and all data.</p>
            <Button danger onClick={() => setShowDeleteModal(true)}>Delete</Button>
          </div>
        </div>
      </main>

      <Modal
        title="Delete Account"
        open={showDeleteModal}
        onOk={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setConfirmText("");
        }}
        okText="Delete"
        okButtonProps={{ danger: true, loading: deleting }}
      >
        <p>This action cannot be undone.</p>
        <p>Type "delete" to confirm:</p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="delete"
          className="delete-input"
        />
      </Modal>
    </>
  );
};

export default Settings;

