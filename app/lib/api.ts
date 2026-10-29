// app/lib/api.ts
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
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = typeof errData.detail === "string" ? errData.detail : "Failed to exchange SSO code";
      const err = new Error(msg);
      (err as any).status = res.status;
      throw err;
    }
    return res.json();
  },
  getMe: async () => {
    try {
      const res = await authFetch("/auth/me");
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
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
    return authFetch("/enrollments/" + courseId + "/enroll", { method: "POST" });
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
  enroll: async (courseId: string, demoBypass = false) => {
    const res = await authFetch(
      "/enrollments/" + courseId + "/enroll" + (demoBypass ? "?demo_bypass=true" : ""),
      { method: "POST" }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(typeof err.detail === "string" ? err.detail : "Enrollment failed");
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

// Admin endpoints are not built in the LMS backend yet. These are placeholders
// so the old admin page still type-checks; they intentionally do nothing.
const notImplemented = (): Promise<Response> =>
  Promise.reject(new Error("Admin API not implemented yet"));

export const adminAPI = {
  getStats: () => authFetch("/courses/languages"),
  getUsers: () => authFetch("/auth/me"),
  updateRole: (_id: string, _role: string) => notImplemented(),
  toggleStatus: (_id: string) => notImplemented(),
  deleteUser: (_id: string) => notImplemented(),
};

export default authFetch;