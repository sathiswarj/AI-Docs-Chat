import api from "./api.service";

export const chatService = {
  getHistory: () => api.get("/chat/history"),
  sendMessage: (prompt) => api.post("/chat", { prompt }),
};

export default chatService;
