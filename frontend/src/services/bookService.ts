import axios from 'axios';
import { Book } from '../types/Book';

const API_URL = 'http://127.0.0.1:8000/api/';

export interface UploadResponse {
  status: "success";
  book_id: string;
  summary: {
    sections: string[];
    key_terms: string[];
    page_count: number;
  };
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

const getAll = async (notebook_id: number, userId: number): Promise<Book[]> => {
  const response = await axios.post<Book[]>(`${API_URL}notebooks/${notebook_id}/books/`, { user_id: userId });
  return response.data;
};

const getBookById = async (notebook_id: number, id: number): Promise<Book> => {
  const response = await axios.get<Book>(`${API_URL}notebooks/${notebook_id}/books/${id}/`);
  return response.data;
};

const uploadBook = async (notebook_id: number, book: { user_id: number, notebook_id: number, title: string, pdf_file: Blob }): Promise<UploadResponse> => {
  const response = await axios.post<UploadResponse>(`${API_URL}notebooks/${notebook_id}/books/`, book);
  return response.data;
};

const deleteBook = async (notebook_id: number, id: number): Promise<DeleteResponse> => {
  const response = await axios.post<DeleteResponse>(`${API_URL}notebooks/${notebook_id}/books/${id}/`);
  return response.data;
};

const getBookTitles = async (id: number): Promise<titleListResponse> => {
  const response = await axios.post<titleListResponse>(`${API_URL}notebooks/${id}/books/titles/`);
  return response.data;
};

const getSummary = async (notebook_id: number, id: number): Promise<summaryResponse> => {
  const response = await axios.post<summaryResponse>(`${API_URL}notebooks/${notebook_id}/books/${id}/summary/`);
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