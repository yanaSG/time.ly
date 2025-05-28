import api from '../utils/api'; // uses axios with token handling

interface Notebook {
  id:number;
  title:string;
  content:string;
}

// GET all notebooks
export const fetchNotebooks=async():Promise<Notebook[]>=>{
  const res=await api.get('/notebooks/');
  return res.data;
};

// POST a new notebook
export const createNotebook=async(notebook:Omit<Notebook,'id'>):Promise<Notebook>=>{
  const res=await api.post('/notebooks/', notebook);
  return res.data;
};

// PUT update notebook
export const updateNotebook=async(id:number, notebook:Partial<Notebook>):Promise<Notebook>=>{
  const res=await api.put(`/notebooks/${id}/`, notebook);
  return res.data;
};

// DELETE notebook
export const deleteNotebook=async(id:number)=>{
  await api.delete(`/notebooks/${id}/`);
};
