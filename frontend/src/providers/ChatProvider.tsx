// context/ChatProvider.tsx
import React, {createContext, useContext, useState, useEffect, ReactNode} from "react";
import chatService from '../services/chatService';


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

  // Initialize messages from localStorage or set default system message
  const [messages, setMessages] = useState<Message[]>(() => {

    // Attempt to retrieve messages from localStorage
    const saved = localStorage.getItem("chat_messages");

    // If messages exist, parse them; otherwise, return default system message
    if (saved) {
      try {
        // Parse the saved messages
        const parsed = JSON.parse(saved);
        // Cast and filter to ensure correct types
        return Array.isArray(parsed)
          ? parsed.filter(
            // Type guard to ensure each message is of type Message
              (msg): msg is Message =>
                // Check if msg has role and content properties
                typeof msg.content === "string" &&
                ["user", "system", "assistant"].includes(msg.role)
            )
            // If parsing is successful, return the parsed messages
          : [{ role: "system", content: "You are a helpful assistant." }];
      } catch {
        // If parsing fails, fallback to default
        return [{ role: "system", content: "You are a helpful assistant." }];
      }
    }
    return [{ role: "system", content: "You are a helpful assistant." }];
  });

  // State to manage user input
  const [userInput, setUserInput] = useState("");

  // Persist messages in localStorage
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    
    // Prevent sending empty messages
    if (!userInput.trim()) return;

    // Update messages with the new user input
    const updatedMessages = [...messages, {role: "user" as "user", content: userInput}];
    //
    setMessages(updatedMessages);
    setUserInput("");

    // add
    // Optimistically add a loading assistant message
    const loadingMessage = { role: "assistant" as "assistant", content: "..." };
    setMessages(prev => [...prev, loadingMessage]);
    let loadingIndex = updatedMessages.length; // index of the loading message

    try {
      // Use chatService.chatbot instead of api.post directly
      const res = await chatService.chatbot(updatedMessages);

      const assistantReply = res?.choices?.[0]?.message?.content || "No reply.";
      //setMessages(prev => [...prev, { role: "assistant", content: assistantReply }]);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[loadingIndex] = { role: "assistant", content: assistantReply };
        return newMessages;
      });

    } catch (err) {
      //console.error("Chat API error:", err);
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[loadingIndex] = { role: "assistant", content: "Sorry, something went wrong." };
          return newMessages;
      });
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
export type { Message };

