// src/hooks/useNotebookContent.ts
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';

interface NotebookContentApiResponse {
    notebook: number;
    markdown_content: string;
    updated_at: string;
}

interface NotebookContentContextType {
    contentUpdatedAt: string | null;
    currentContent: string | null;
    isLoading: boolean;
    error: string | null;
    getNotebookContent: (notebookId: number) => Promise<string | null>;
    updateNotebookContent: (notebookId: number, content: string) => Promise<void>;
}

const NotebookContentContext = createContext<NotebookContentContextType | undefined>(undefined);

export const NotebookContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    const [currentContent, setCurrentContent] = useState<string | null>(null);
    const [contentUpdatedAt, setContentUpdatedAt] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getNotebookContent = useCallback(async (notebookId: number): Promise<string | null> => {
        setIsLoading(true);
        setError(null);
        if (!user) {
            setError('User not authenticated.');
            setIsLoading(false);
            return null;
        }

        try {
            const response = await api.get<NotebookContentApiResponse>(`/notebooks/${notebookId}/content/`);
            setCurrentContent(response.data.markdown_content);
            setContentUpdatedAt(response.data.updated_at);
            return response.data.markdown_content;
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Failed to fetch notebook content.');
            console.error('useNotebookContent: Error fetching notebook content:', err);
            setCurrentContent(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const updateNotebookContent = useCallback(async (notebookId: number, content: string): Promise<void> => {
        console.log('useNotebookContent: Inside updateNotebookContent. User:', user);
        console.log('useNotebookContent: Attempting to update content for notebookId:', notebookId, 'with content:', content);

        setIsLoading(true);
        setError(null);

        if (!user) {
            setError('User not authenticated. Cannot save content.');
            console.error('useNotebookContent: User is null, skipping API call for update.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.put(`/notebooks/${notebookId}/content/`, { notebook: notebookId, markdown_content: content });
            setCurrentContent(content);
            console.log('useNotebookContent: Notebook content updated successfully. Response:', response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Failed to update notebook content.');
            console.error('useNotebookContent: Error updating notebook content:', err.response?.data || err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const contextValue = {
        currentContent,
        contentUpdatedAt,
        isLoading,
        error,
        getNotebookContent,
        updateNotebookContent,
    };

    return (
        <NotebookContentContext.Provider value={contextValue}>
            {children}
        </NotebookContentContext.Provider>
    );
};

export const useNotebookContent = () => {
    const context = useContext(NotebookContentContext);
    if (!context) {
        throw new Error('useNotebookContent must be used within a NotebookContentProvider');
    }
    return context;
};
