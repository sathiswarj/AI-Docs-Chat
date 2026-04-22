import api from "./api.service";

export const authService = {
  register: (userData) => api.post("/auth/register", userData),
  login: (email, password) => api.post("/auth/login", { email, password }),
  getCurrentUser: () => api.get("/auth/me"),
};

export default authService;
