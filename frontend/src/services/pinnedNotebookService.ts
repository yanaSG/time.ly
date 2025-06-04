import { api } from '../api/client'; // Assuming you have an Axios instance configured here

const pinnedNotebookService = {
  // Pin a notebook
  pinNotebook: async (notebookId: number, order?: number) => {
    const payload = { notebook_id: notebookId, order: order };
    const response = await api.post("pinned-notebooks/", payload);
    return response.data;
  },

  // Unpin a notebook
  unpinNotebook: async (pinnedNotebookId: number) => {
    const response = await api.delete(`pinned-notebooks/${pinnedNotebookId}/`);
    return response.data;
  },

  // Get all pinned notebooks for the user (can also be fetched via user profile)
  getPinnedNotebooks: async () => {
    const response = await api.get("pinned-notebooks/");
    return response.data;
  },
};

export default pinnedNotebookService;
