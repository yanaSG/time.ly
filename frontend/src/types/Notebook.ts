export interface Notebook {
    id: number;
    user_id: number;
    title: string;
    description: string;
    color: string;
    mastery_goal?: string;
    created_at?: string;    
    updated_at?: string;
}