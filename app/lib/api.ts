const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // Auto-refresh if access token expired
  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      localStorage.clear();
      window.location.href = "/auth/login";
      return;
    }

    const refreshRes = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) {
      localStorage.clear();
      window.location.href = "/auth/login";
      return;
    }

    const { data } = await refreshRes.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return fetch(`${BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
        ...options.headers,
      },
    });
  }

  return res;
};

export const courseAPI = {
  getAll: (params = "") => authFetch(`/courses?${params}`),
  getOne: (id: string) => authFetch(`/courses/${id}`),
  getByLanguage: (language: string) =>
    authFetch(`/courses?language=${encodeURIComponent(language)}`),
  getInstructorCourses: () => authFetch("/courses/instructor/mine"),
  getMyCourses: () => authFetch("/courses/user/enrolled"),
  enroll: (id: string) =>
    authFetch(`/courses/${id}/enroll`, { method: "POST" }),
  create: (body: object) =>
    authFetch("/courses", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: object) =>
    authFetch(`/courses/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) =>
    authFetch(`/courses/${id}`, { method: "DELETE" }),
  addResource: (courseId: string, resource: object) =>
    authFetch(`/courses/${courseId}/resources`, {
      method: "POST",
      body: JSON.stringify(resource),
    }),
  deleteResource: (courseId: string, resourceId: string) =>
    authFetch(`/courses/${courseId}/resources/${resourceId}`, {
      method: "DELETE",
    }),
};

export const adminAPI = {
  getStats: () => authFetch("/admin/stats"),
  getUsers: () => authFetch("/admin/users"),
  getAdminCourses: () => authFetch("/admin/courses"),
  updateRole: (id: string, role: string) =>
    authFetch(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
  toggleStatus: (id: string) =>
    authFetch(`/admin/users/${id}/status`, { method: "PATCH" }),
  deleteUser: (id: string) =>
    authFetch(`/admin/users/${id}`, { method: "DELETE" }),
  deleteCourse: (id: string) =>
    authFetch(`/admin/courses/${id}`, { method: "DELETE" }),
};

export const authAPI = {
  forgotPassword: (email: string) =>
    fetch(`${BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    fetch(`${BASE}/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }),
};

export default authFetch;
