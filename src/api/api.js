import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getProjects(opts = {}) {
  const { page = 1, limit = 10 } = opts;
  const res = await api.get("/projects", { params: { page, limit } });
  const data = res.data;

  if (Array.isArray(data)) {
    return { projects: data, total_projects: data.length, page, limit };
  }

  return {
    projects: data.projects || [],
    total_projects: data.total_projects || data.totalProjects || 0,
    page: data.page || page,
    limit: data.limit || limit,
  };
}

export async function getTasks(projectId, opts = {}) {
  const { page = 1, limit = 10 } = opts;
  const res = await api.get(`/projects/${projectId}/tasks`, { params: { page, limit } });
  const data = res.data;

  if (Array.isArray(data)) {
    return { tasks: data, total_tasks: data.length, page, limit };
  }

  return {
    tasks: data.tasks || [],
    total_tasks: data.total_tasks || data.totalTasks || 0,
    page: data.page || page,
    limit: data.limit || limit,
  };
}

export async function getProject(projectId) {
  const res = await api.get(`/projects/${projectId}`);
  const data = res.data;
  return data.id ? data : data.project || data;
}

export default api;
