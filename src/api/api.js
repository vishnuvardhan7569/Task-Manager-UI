import axios from "axios";

/**
 * @typedef {Object} Project
 * @property {number|string} id
 * @property {string} name
 * @property {string} domain
 * @property {string} [description]
 * @property {number} [completed_tasks]
 * @property {number} [total_tasks]
 * @property {number} [percent]
 */

/**
 * @typedef {Object} ProjectsResponse
 * @property {Project[]} projects
 * @property {number} total_projects
 * @property {number} [page]
 * @property {number} [limit]
 */

/**
 * @typedef {Object} Task
 * @property {number|string} id
 * @property {string} title
 * @property {string} [description]
 * @property {string} [status]
 */

/**
 * @typedef {Object} TasksResponse
 * @property {Task[]} tasks
 * @property {number} total_tasks
 * @property {number} [page]
 * @property {number} [limit]
 */

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

/**
 * Fetch projects with optional pagination. Normalizes response to { projects, total_projects, page, limit }.
 * Accepts either an array response (legacy) or an object with { projects, total_projects }.
 * @param {{page?: number, limit?: number}} [opts]
 * @returns {Promise<ProjectsResponse>}
 */
export async function getProjects(opts = {}) {
  const { page = 1, limit = 10 } = opts;
  const res = await api.get("/projects", { params: { page, limit } });
  const data = res.data;

  if (Array.isArray(data)) {
    return { projects: data, total_projects: data.length, page, limit };
  }

  return {
    projects: data.projects || [],
    total_projects: data.total_projects || data.totalProjects || data.total || 0,
    page: data.page || page,
    limit: data.limit || limit,
  };
}

/**
 * Fetch tasks for a project with optional pagination. Normalizes response to { tasks, total_tasks, page, limit }.
 * Accepts either an array response (legacy) or an object with { tasks, total_tasks }.
 * @param {string|number} projectId
 * @param {{page?: number, limit?: number}} [opts]
 * @returns {Promise<TasksResponse>}
 */
export async function getTasks(projectId, opts = {}) {
  const { page = 1, limit = 10 } = opts;
  const res = await api.get(`/projects/${projectId}/tasks`, { params: { page, limit } });
  const data = res.data;

  if (Array.isArray(data)) {
    return { tasks: data, total_tasks: data.length, page, limit };
  }

  return {
    tasks: data.tasks || [],
    total_tasks: data.total_tasks || data.totalTasks || data.total || 0,
    page: data.page || page,
    limit: data.limit || limit,
  };
}

/**
 * Fetch a single project by id. Normalizes response to return the project object.
 * Accepts either { id, ... } or { project: { ... } } shapes.
 * @param {string|number} projectId
 * @returns {Promise<Project>}
 */
export async function getProject(projectId) {
  const res = await api.get(`/projects/${projectId}`);
  const data = res.data;
  if (data && data.id) return data;
  return data.project || data;
}

export default api;
