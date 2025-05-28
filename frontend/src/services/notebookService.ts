import axios from 'axios';
import { Notebook } from '../types/Notebook';

const API_URL = 'http://127.0.0.1:8000/api/';

const getAll = async (user_id: number): Promise<Notebook[]> => {
  const response = await axios.post<Notebook[]>(`${API_URL}notebooks/`, user_id);
  return response.data;
};

const getNotebookById = async (id: number): Promise<Notebook | undefined> => {
  const response = await axios.get<Notebook>(`${API_URL}notebooks/${id}/`);
  return response.data;
};

const addNotebook = async (notebook: Notebook): Promise<any> => {
  const response = await axios.post<any>(`${API_URL}notebooks/`, notebook);
  return response.data;
};

const updateNotebook = async (id: number, notebook: Notebook): Promise<any> => {
  const response = await axios.post<any>(`${API_URL}notebooks/${id}/books/`, notebook);
  return response.data;
};

const deleteNotebook = async (id: number): Promise<any> => {
  const response = await axios.post<any>(`${API_URL}notebooks/${id}/`);
  return response.data;
};

export default {
  getAll,
  getNotebookById,
  addNotebook,
  deleteNotebook,
  updateNotebook
};