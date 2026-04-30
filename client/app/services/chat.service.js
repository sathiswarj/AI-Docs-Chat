import api from "./api.service";

export const chatService = {
  getConversations: () => api.get("/conversations"),
  getHistory: (conversationId) => api.get(`/chat/history/${conversationId}`),
  sendMessage: (prompt, conversationId, signal) => api.post("/chat", { prompt, conversationId }, { signal }),
  deleteConversation: (id) => api.delete(`/conversation/${id}`),
};

export default chatService;
