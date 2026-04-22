import api from "./api.service";

export const fileService = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post("/upload", formData);
  },
  delete: () => api.delete("/delete-file"),
};

export default fileService;
