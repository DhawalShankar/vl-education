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

/* ── Auth API ──────────────────────────────────────────────────────────
 * Handles SSO token exchange with main VartaLang backend and user verification.
 */
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

/* ── Course API ────────────────────────────────────────────────────────
 * Connects to LMS courses catalog, language taxonomy, and instructor course builder.
 */
export const courseAPI = {
  // TODO: Connect to backend API: GET /api/v1/courses/languages (fetch supported vernacular languages)
  getLanguages: async () => {
    const res = await authFetch("/courses/languages");
    if (!res.ok) return [];
    return res.json();
  },
  // TODO: Connect to backend API: GET /api/v1/courses/instructors (fetch verified educators)
  getInstructors: async (language?: string) => {
    const url = language
      ? "/courses/instructors?language=" + encodeURIComponent(language)
      : "/courses/instructors";
    const res = await authFetch(url);
    if (!res.ok) return [];
    return res.json();
  },
  // TODO: Connect to backend API: GET /api/v1/courses (filter courses by language, level, instructor)
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
  // TODO: Connect to backend API: GET /api/v1/courses/:id (course curriculum details and resources)
  getOne: async (courseId: string) => {
    const res = await authFetch("/courses/" + courseId);
    if (!res.ok) throw new Error("Course not found");
    return res.json();
  },
  // TODO: Connect to backend API: GET /api/v1/courses?language=:language
  getByLanguage: async (language: string) => {
    return authFetch("/courses?language=" + encodeURIComponent(language));
  },
  // TODO: Connect to backend API: GET /api/v1/courses/instructor/mine (fetch current instructor's courses)
  getInstructorCourses: async () => {
    return authFetch("/courses/instructor/mine");
  },
  // TODO: Connect to backend API: GET /api/v1/enrollments/mine (fetch logged-in learner's enrolled courses)
  getMyCourses: async () => {
    return authFetch("/enrollments/mine");
  },
  // TODO: Connect to backend API: POST /api/v1/enrollments/:courseId/enroll
  enroll: async (courseId: string) => {
    return authFetch("/enrollments/" + courseId + "/enroll", { method: "POST" });
  },
  // TODO: Connect to backend API: POST /api/v1/courses (create new course)
  create: async (body: object) => {
    return authFetch("/courses", { method: "POST", body: JSON.stringify(body) });
  },
  // TODO: Connect to backend API: PUT /api/v1/courses/:id (update course details & resources)
  update: async (id: string, body: object) => {
    return authFetch("/courses/" + id, { method: "PUT", body: JSON.stringify(body) });
  },
  // TODO: Connect to backend API: DELETE /api/v1/courses/:id (delete course)
  delete: async (id: string) => {
    return authFetch("/courses/" + id, { method: "DELETE" });
  },
};

/* ── Enrollment & Progress API ─────────────────────────────────────────
 * Tracks student enrollment, lesson completion, and practice progress.
 */
export const enrollmentAPI = {
  // TODO: Connect to backend API: POST /api/v1/enrollments/:courseId/enroll
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
  // TODO: Connect to backend API: GET /api/v1/enrollments/mine
  getMyCourses: async () => {
    const res = await authFetch("/enrollments/mine");
    if (!res.ok) return [];
    return res.json();
  },
  // TODO: Connect to backend API: POST /api/v1/enrollments/:courseId/lessons/:lessonId/toggle
  toggleLesson: async (courseId: string, lessonId: string) => {
    const res = await authFetch("/enrollments/" + courseId + "/lessons/" + lessonId + "/toggle", {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to update progress");
    return res.json();
  },
  // TODO: Connect to backend API: GET /api/v1/enrollments/:courseId/progress
  getProgress: async (courseId: string) => {
    const res = await authFetch("/enrollments/" + courseId + "/progress");
    if (!res.ok) return null;
    return res.json();
  },
};

/* ── Admin API ──────────────────────────────────────────────────────────
 * TODO: Backend Implementation Needed:
 * - GET /api/v1/admin/stats (platform-wide metrics from database)
 * - GET /api/v1/admin/users (paginated user management with role filtering)
 * - PATCH /api/v1/admin/users/:id/role (promote/demote user roles)
 * - PATCH /api/v1/admin/users/:id/status (suspend/activate accounts)
 * - DELETE /api/v1/admin/users/:id (permanent account deletion)
 * These stub placeholders prevent client-side build errors until the backend is connected.
 */
const notImplemented = (): Promise<Response> =>
  Promise.reject(new Error("Admin API not implemented yet in backend"));

export const adminAPI = {
  getStats: () => authFetch("/courses/languages"),
  getUsers: () => authFetch("/auth/me"),
  updateRole: (_id: string, _role: string) => notImplemented(),
  toggleStatus: (_id: string) => notImplemented(),
  deleteUser: (_id: string) => notImplemented(),
};

export default authFetch;
