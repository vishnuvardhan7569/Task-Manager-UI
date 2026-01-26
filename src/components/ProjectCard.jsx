import { Card, Button, Modal, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const confirmDelete = () => {
    onDelete(project.id);
    setConfirmOpen(false);
  };

  return (
    <>
      <Card
        className="project-card"
        hoverable
        variant="borderless"
      >
        <div className="project-card-header">
          <h4>{project.name}</h4>
          <Tag color="blue">{project.domain}</Tag>
        </div>

        <p className="project-description">
          {project.description || "No description provided"}
        </p>

        <div className="project-card-actions">
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(project)}
          >
            Edit
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </Button>
        </div>
      </Card>

      <Modal
        open={confirmOpen}
        title="Delete Project"
        onCancel={() => setConfirmOpen(false)}
        onOk={confirmDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{project.name}</strong>?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default ProjectCard;
