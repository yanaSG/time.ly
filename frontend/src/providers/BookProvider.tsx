import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Book } from '../types/Book';
import bookService from '../services/bookService';
import { useAuth } from '../hooks/useAuth';
import { useNotebooks } from './NotebookProvider';

interface BookContextType {
    books: Book[];
    currentBook: Book | null;
    isLoading: boolean;
    error: string | null;
    fetchBooks: () => Promise<void>;
    getBookById: (notebook_id: number, id: number) => Promise<void>;
    uploadBook: (notebook_id: number, book: FormData) => Promise<string | undefined>;
    deleteBook: (notebook_id: number, id: number) => Promise<void>;
    getBookTitles: (notebookId: number, id: number) => Promise<{id: number, title: string}[]>;
    getSummary: (notebookId: number, id: number) => Promise<string>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [currentBook, setCurrentBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { currentNotebook } = useNotebooks();

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await bookService.getAll(currentNotebook!.id, user!.id);
            setBooks(response);
        } catch (err) {
            setError('Failed to fetch books');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getBookById = useCallback(async (notebook_id: number, id: number) => {
        setIsLoading(true);
        try {
            const response = await bookService.getBookById(notebook_id, id);
            setCurrentBook(response);
        } catch (err) {
            setError('Book not found');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const uploadBook = async (notebook_id: number, book: FormData) => {
        setIsLoading(true);
        try {
            const response = await bookService.uploadBook(notebook_id, book);
            await fetchBooks();
            return response.markdown_summary;
        } catch (err) {
            setError('Failed to upload book: ' + err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBook = async (notebook_id: number, id: number) => {
        setIsLoading(true);
        try {
            await bookService.deleteBook(notebook_id, id);
            await fetchBooks();
            setCurrentBook(null);
        } catch (err) {
            setError('Failed to delete book');
        } finally {
            setIsLoading(false);
        }
    };

    const getBookTitles = async (notebookId: number) => {
        setIsLoading(true);
        try {
            const response = await bookService.getBookTitles(notebookId);
            return response.titles;
        } catch (err) {
            setError('Failed to fetch book titles');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const getSummary = async (notebookId: number, bookId: number) => {
        setIsLoading(true);
        try {
            const response = await bookService.getSummary(notebookId, bookId);
            return response.markdown;
        } catch (err) {
            setError('Failed to fetch book summary');
            return '';
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && currentNotebook) {
            fetchBooks();
        }
    }, [user, currentNotebook]);

    return (
        <BookContext.Provider value={{
            books,
            currentBook,
            isLoading,
            error,
            fetchBooks,
            getBookById,
            uploadBook,
            deleteBook,
            getBookTitles,
            getSummary
        }}>
            {children}
        </BookContext.Provider>
    );
};

export const useBooks = () => {
    const context = useContext(BookContext);
    if (!context) {
        throw new Error('useBooks must be used within a BookProvider');
    }
    return context;
};
