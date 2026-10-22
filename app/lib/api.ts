const BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1";

const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const res = await fetch(BASE + endpoint, {
    ...options,
    headers,
  });

  return res;
};

export const authAPI = {
  ssoExchange: async (code: string) => {
    const res = await authFetch("/auth/sso/exchange", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    if (!res.ok) throw new Error("Failed to exchange SSO code");
    return res.json();
  },
  devLogin: async (email: string, role = "student", fullName = "Dev User") => {
    const res = await authFetch("/auth/dev-login", {
      method: "POST",
      body: JSON.stringify({ email, role, full_name: fullName }),
    });
    if (!res.ok) throw new Error("Dev login failed");
    return res.json();
  },
  getMe: async () => {
    const res = await authFetch("/auth/me");
    if (!res.ok) return null;
    return res.json();
  },
};

export const courseAPI = {
  getLanguages: async () => {
    const res = await authFetch("/courses/languages");
    if (!res.ok) return [];
    return res.json();
  },
  getInstructors: async (language?: string) => {
    const url = language 
      ? "/courses/instructors?language=" + encodeURIComponent(language)
      : "/courses/instructors";
    const res = await authFetch(url);
    if (!res.ok) return [];
    return res.json();
  },
  getAll: async (filters: any = "") => {
    if (typeof filters === "string") {
      return authFetch("/courses" + (filters ? "?" + filters : ""));
    }
    const params = new URLSearchParams();
    if (filters?.language) params.append("language", filters.language);
    if (filters?.instructor_id) params.append("instructor_id", filters.instructor_id);
    if (filters?.level) params.append("level", filters.level);
    const queryString = params.toString() ? "?" + params.toString() : "";
    const res = await authFetch("/courses" + queryString);
    if (!res.ok) return [];
    return res.json();
  },
  getOne: async (courseId: string) => {
    const res = await authFetch("/courses/" + courseId);
    if (!res.ok) throw new Error("Course not found");
    return res.json();
  },
  getByLanguage: async (language: string) => {
    return authFetch("/courses?language=" + encodeURIComponent(language));
  },
  getInstructorCourses: async () => {
    return authFetch("/courses/instructor/mine");
  },
  getMyCourses: async () => {
    return authFetch("/enrollments/mine");
  },
  enroll: async (courseId: string) => {
    return authFetch("/enrollments/" + courseId + "/enroll?demo_bypass=true", { method: "POST" });
  },
  create: async (body: object) => {
    return authFetch("/courses", { method: "POST", body: JSON.stringify(body) });
  },
  update: async (id: string, body: object) => {
    return authFetch("/courses/" + id, { method: "PUT", body: JSON.stringify(body) });
  },
  delete: async (id: string) => {
    return authFetch("/courses/" + id, { method: "DELETE" });
  },
};

export const enrollmentAPI = {
  enroll: async (courseId: string, demoBypass = true) => {
    const res = await authFetch("/enrollments/" + courseId + "/enroll?demo_bypass=" + demoBypass, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Enrollment failed");
    }
    return res.json();
  },
  getMyCourses: async () => {
    const res = await authFetch("/enrollments/mine");
    if (!res.ok) return [];
    return res.json();
  },
  toggleLesson: async (courseId: string, lessonId: string) => {
    const res = await authFetch("/enrollments/" + courseId + "/lessons/" + lessonId + "/toggle", {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to update progress");
    return res.json();
  },
  getProgress: async (courseId: string) => {
    const res = await authFetch("/enrollments/" + courseId + "/progress");
    if (!res.ok) return null;
    return res.json();
  },
};

export const adminAPI = {
  getStats: () => authFetch("/courses/languages"),
  getUsers: () => authFetch("/auth/me"),
  updateRole: (id: string, role: string) =>
    authFetch("/auth/dev-login", { method: "POST", body: JSON.stringify({ role }) }),
  toggleStatus: (id: string) =>
    authFetch("/auth/me", { method: "GET" }),
  deleteUser: (id: string) =>
    authFetch("/auth/me", { method: "GET" }),
};

export default authFetch;
