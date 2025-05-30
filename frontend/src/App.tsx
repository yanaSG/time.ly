import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./providers/AuthProvider";
import { NotebookProvider } from "./providers/NotebookProvider";
import { BookProvider } from "./providers/BookProvider";
import { ChatProvider } from "./providers/ChatProvider";
// import Register from "./features/auth/Register";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotebookProvider>
          <ChatProvider>
            <BookProvider>
              <AppRouter />
            </BookProvider>
            </ChatProvider>
        </NotebookProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}