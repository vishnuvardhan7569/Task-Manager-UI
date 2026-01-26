import { Button, Progress, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const percent =
    project.total_tasks > 0
      ? Math.round((project.completed_tasks / project.total_tasks) * 100)
      : 0;

  return (
    <div
      className="project-card"
      onClick={() => navigate(`/projects/${project.id}/tasks`)}
    >
      {/* Domain badge */}
      <div className="project-domain">{project.domain}</div>

      {/* Title */}
      <h3 className="project-title">{project.name}</h3>

      {/* Description */}
      <p className="project-description">
        {project.description || "No description provided"}
      </p>

      {/* Progress */}
      <div className="project-progress">
        <Progress
          percent={percent}
          size="small"
          strokeColor="#52c41a"
          showInfo={false}
        />
        <span className="progress-text">
          {project.completed_tasks}/{project.total_tasks} tasks completed
        </span>
      </div>

      {/* Actions */}
      <div
        className="project-card-actions"
        onClick={(e) => e.stopPropagation()} // 🔥 critical
      >
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEdit(project)}
        >
          Edit
        </Button>

        <Popconfirm
          title="Delete project?"
          description="This action cannot be undone."
          okText="Delete"
          cancelText="Cancel"
          onConfirm={() => onDelete(project.id)}
        >
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default ProjectCard;
