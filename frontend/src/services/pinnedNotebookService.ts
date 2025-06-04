import { api } from '../api/client';

const pinnedNotebookService = {
  pinNotebook: async (notebookId: number, order?: number) => {
    const payload = { notebook_id: notebookId, order: order };
    const response = await api.post("pinned-notebooks/", payload);
    return response.data;
  },

  unpinNotebook: async (pinnedNotebookId: number) => {
    const response = await api.delete(`pinned-notebooks/${pinnedNotebookId}/`);
    return response.data;
  },

  getPinnedNotebooks: async () => {
    const response = await api.get("pinned-notebooks/");
    return response.data;
  },
};

export default pinnedNotebookService;
