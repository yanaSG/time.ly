import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from '../api/client';
import { Notebook } from '../types/Notebook';

const getAll = async (user_id: number, config?: AxiosRequestConfig): Promise<Notebook[]> => {
  const response = await api.get<Notebook[]>(`notebooks/`, {
    ...config,
    params: { user_id }
  });
  return response.data;
};

const getNotebookById = async (id: number, config?: AxiosRequestConfig): Promise<Notebook | undefined> => {
  const response = await api.get<Notebook>(`notebooks/${id}/`, config);
  return response.data;
};

const addNotebook = async (notebook: Omit<Notebook, "id" | "created_at" | "updated_at">, config?: AxiosRequestConfig): Promise<any> => {
  const response = await api.post<any>(`notebooks/`, notebook, config);
  return response.data;
};

const updateNotebook = async (id: number, notebook: Partial<Notebook>, config?: AxiosRequestConfig): Promise<any> => {
  const response = await api.put<any>(`notebooks/${id}/`, notebook, config);
  return response.data;
};

const deleteNotebook = async (id: number, config?: AxiosRequestConfig): Promise<any> => {
  const response = await api.delete<any>(`notebooks/${id}/`, config);
  return response.data;
};

export default {
  getAll,
  getNotebookById,
  addNotebook,
  deleteNotebook,
  updateNotebook
};
