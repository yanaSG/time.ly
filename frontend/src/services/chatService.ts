import { AxiosRequestConfig } from 'axios';
import { api } from '../api/client';

interface MessageResponse {
  choices: {
    message: {
      role: "assistant" | "user" | "system";
      content: string;
    };
  }[];                          
}

const chatbot = async (messages: { role: "user" | "assistant" | "system"; content: string }[], config?: AxiosRequestConfig): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(`chat/`,  { messages}, config);
  return response.data;
};


export default {
 chatbot
};