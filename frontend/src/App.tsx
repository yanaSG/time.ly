import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./providers/AuthProvider";
import { NotebookProvider } from "./providers/NotebookProvider";
import { BookProvider } from "./providers/BookProvider";
import { NotebookContentProvider } from "./providers/NotebookContentProvider";
import { ChatProvider } from "./providers/ChatProvider";
// import Register from "./features/auth/Register";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotebookProvider>
          <NotebookContentProvider>
          <ChatProvider>
            <BookProvider>
              <AppRouter />
            </BookProvider>
            </ChatProvider>
          </NotebookContentProvider>
        </NotebookProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}