import api from "./api.service";

export const chatService = {
  getConversations: () => api.get("/conversations"),
  getHistory: (conversationId) => api.get(`/chat/history/${conversationId}`),
  sendMessage: (prompt, conversationId) => api.post("/chat", { prompt, conversationId }),
  deleteConversation: (id) => api.delete(`/conversation/${id}`),
};

export default chatService;
