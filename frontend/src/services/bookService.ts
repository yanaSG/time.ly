import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from '../api/client';
import { Book } from '../types/Book';

export interface UploadResponse {
  status: "success";
  book_id: string;
  markdown_summary: string;
}

export interface DeleteResponse {
  message: string;
}

export interface titleListResponse {
  titles: { id: number, title: string }[];
}

export interface summaryResponse {
  markdown: string;
}

const getAll = async (notebook_id: number, userId: number, config?: AxiosRequestConfig): Promise<Book[]> => {
  const response = await api.post<Book[]>(`notebooks/${notebook_id}/books/`, { user_id: userId }, config);
  return response.data;
};

const getBookById = async (notebook_id: number, id: number, config?: AxiosRequestConfig): Promise<Book> => {
  const response = await api.get<Book>(`notebooks/${notebook_id}/books/${id}/`, config);
  return response.data;
};

const uploadBook = async (notebook_id: number, book: FormData, config?: AxiosRequestConfig): Promise<UploadResponse> => {
  const response = await api.post<UploadResponse>(`notebooks/${notebook_id}/books/`, book, config);
  return response.data;
};

const deleteBook = async (notebook_id: number, id: number, config?: AxiosRequestConfig): Promise<DeleteResponse> => {
  const response = await api.post<DeleteResponse>(`notebooks/${notebook_id}/books/${id}/`, config);
  return response.data;
};

const getBookTitles = async (id: number, config?: AxiosRequestConfig): Promise<titleListResponse> => {
  const response = await api.post<titleListResponse>(`notebooks/${id}/books/titles/`, config);
  return response.data;
};

const getSummary = async (notebook_id: number, id: number, config?: AxiosRequestConfig): Promise<summaryResponse> => {
  const response = await api.post<summaryResponse>(`notebooks/${notebook_id}/books/${id}/summary/`, config);
  return response.data;
};

export default {
  getAll,
  getBookById,
  uploadBook,
  deleteBook,
  getBookTitles,
  getSummary
};