import { Button, Progress } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const percent = Number(project.percent) || 0;
  const completedTasks = Number(project.completed_tasks) || 0;
  const totalTasks = Number(project.total_tasks) || 0;

  return (
    <div
      className="project-card"
      onClick={() => navigate(`/projects/${project.id}/tasks`)}
    >
      <div className="project-domain">{project.domain}</div>

      <h3 className="project-title">{project.name}</h3>

      <p className="project-description">
        {project.description || "No description provided for this project."}
      </p>

      <div className="project-progress">
        <Progress
          percent={percent}
          size="small"
          strokeColor={{
            '0%': '#6366f1',
            '100%': '#8b5cf6',
          }}
          showInfo={false}
        />
        <span className="progress-text">
          {completedTasks}/{totalTasks} tasks completed
        </span>
      </div>

      <div
        className="project-card-actions"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEdit(project)}
        >
          Edit
        </Button>

        <Button
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(project.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
