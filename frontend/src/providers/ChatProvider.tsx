// context/ChatProvider.tsx
import React, {createContext, useContext, useState, useEffect, ReactNode} from "react";
import {api} from "../api/client";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatContextType {
  messages: Message[];
  userInput: string;
  setUserInput: (input: string) => void;
  sendMessage: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider: React.FC<{children: ReactNode}> = ({children}) => {

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chat_messages");
    return saved
      ? JSON.parse(saved)
      : [{role: "system", content: "You are a helpful assistant."}];
  });

  const [userInput, setUserInput] = useState("");

  // Persist messages in localStorage
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    
    if (!userInput.trim()) return;

    const updatedMessages = [...messages, {role: "user", content: userInput}];
    setMessages(updatedMessages);
    setUserInput("");

    try {
      const res = await api.post("/chat_with_deepseek", {
        messages: updatedMessages
      });

      const assistantReply = res.data?.choices?.[0]?.message?.content || "No reply.";
      setMessages(prev => [...prev, {role: "assistant", content: assistantReply}]);
    } catch (err) {
      console.error("Chat API error:", err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        userInput,
        setUserInput,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext };

