import { Button, Progress } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const percent =
    project.total_tasks >= 0 ? Math.round((project.completed_tasks / project.total_tasks) * 100) : 0;

  return (
    <div
      className="project-card"
      onClick={() => navigate(`/projects/${project.id}/tasks`)}
    >
      <div className="project-domain">{project.domain}</div>

      <h3 className="project-title">{project.name}</h3>

      <p className="project-description">
        {project.description || "No description provided"}
      </p>

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
            onClick={()=> onDelete(project.id)}
          >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
