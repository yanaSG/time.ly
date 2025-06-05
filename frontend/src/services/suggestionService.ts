import { api } from '../api/client';

const suggestionService = {
  fetchNotebookSuggestion: async (
    notebook: { title: string; topics: string; mastery_goal: string }
  ) => {
    const response = await api.post(
      'notebook-suggestion/',
      notebook
    );
    return response.data.suggestion;
  },
};

export default suggestionService;