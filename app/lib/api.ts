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

    // Retry original request with new token
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
  // Public — published courses only (student browse + admin overview)
  getAll: (params = "") => authFetch(`/courses?${params}`),

  getOne: (id: string) => authFetch(`/courses/${id}`),

  // Filter courses by language name
  getByLanguage: (language: string) => authFetch(`/courses?language=${encodeURIComponent(language)}`),

  // ✅ NEW — instructor ke saare courses (drafts bhi), backend se filtered
  getInstructorCourses: () => authFetch("/courses/instructor/mine"),

  // Student — apne enrolled courses
  getMyCourses: () => authFetch("/courses/user/enrolled"),

  enroll: (id: string) =>
    authFetch(`/courses/${id}/enroll`, { method: "POST" }),

  create: (body: object) =>
    authFetch("/courses", { method: "POST", body: JSON.stringify(body) }),

  update: (id: string, body: object) =>
    authFetch(`/courses/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: string) =>
    authFetch(`/courses/${id}`, { method: "DELETE" }),
};

export const adminAPI = {
  getStats: () => authFetch("/admin/stats"),
  getUsers: () => authFetch("/admin/users"),
  updateRole: (id: string, role: string) =>
    authFetch(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
  toggleStatus: (id: string) =>
    authFetch(`/admin/users/${id}/status`, { method: "PATCH" }),
  deleteUser: (id: string) =>
    authFetch(`/admin/users/${id}`, { method: "DELETE" }),
};

export default authFetch;