import api from "./api.service";

export const fileService = {
  upload: (file, conversationId) => {
    const formData = new FormData();
    formData.append('file', file);
    if (conversationId) formData.append('conversationId', conversationId);
    return api.post("/upload", formData);
  },
  getActiveDocument: (conversationId) => api.get("/active-document", { params: { conversationId } }),
  delete: () => api.delete("/delete-file"),
};

export default fileService;
