export interface Book {
    id: string;
    user_id: string;
    notebook_id: string;
    title: string;
    pdf_file: Blob;
    uploaded_at: string;
}