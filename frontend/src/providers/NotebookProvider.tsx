import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notebook } from '../types/Notebook';
import notebookService from '../services/notebookService';
import { useAuth } from '../hooks/useAuth';

interface NotebookContextType {
    notebooks: Notebook[];
    currentNotebook: Notebook | null;
    isLoading: boolean;
    error: string | null;
    fetchNotebooks: () => Promise<void>;
    getNotebookById: (id: number) => Promise<Notebook | undefined>;
    addNotebook: (notebook: Omit<Notebook, "id" | "created_at" | "updated_at">) => Promise<any>;
    updateNotebook: (id: number, notebook: Notebook) => Promise<any>;
    deleteNotebook: (id: number) => Promise<any>;
}

const NotebookContext = createContext<NotebookContextType | undefined>(undefined);

export const NotebookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [currentNotebook, setCurrentNotebook] = useState<Notebook | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchNotebooks = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await notebookService.getAll(user!.id);
            setNotebooks(response);
        } catch (err) {
            setError('Failed to fetch notebooks');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getNotebookById = useCallback(async (id: number) => {
        setIsLoading(true);
        try {
            const response = await notebookService.getNotebookById(id);
            setCurrentNotebook(response ?? null);
            return response;
        } catch (err) {
            setError('Notebook not found');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addNotebook = async (notebook: Omit<Notebook, "id" | "created_at" | "updated_at">) => {
        setIsLoading(true);
        try {
            const response = await notebookService.addNotebook(notebook);
            await fetchNotebooks();
            return response;
        } catch (err) {
            setError('Failed to add notebook');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteNotebook = async (id: number) => {
        setIsLoading(true);
        try {
            await notebookService.deleteNotebook(id);
            await fetchNotebooks();
            setCurrentNotebook(null);
        } catch (err) {
            setError('Failed to delete notebook');
        } finally {
            setIsLoading(false);
        }
    };

    const updateNotebook = async (id: number, notebook: Notebook) => {
        setIsLoading(true);
        try {
            const response = await notebookService.updateNotebook(id, notebook);
            await fetchNotebooks();
            return response;
        } catch (err) {
            setError('Failed to update notebook');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && notebooks) {
            fetchNotebooks();
        }
    }, [user, notebooks]);

    return (
        <NotebookContext.Provider value={{
            notebooks,
            currentNotebook,
            isLoading,
            error,
            fetchNotebooks,
            getNotebookById,
            addNotebook,
            updateNotebook,
            deleteNotebook
        }}>
            {children}
        </NotebookContext.Provider>
    );
};

export const useNotebooks = () => {
    const context = useContext(NotebookContext);
    if (!context) {
        throw new Error('useNotebooks must be used within a BookProvider');
    }
    return context;
};
