import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./providers/AuthProvider";
import { NotebookProvider } from "./providers/NotebookProvider";
import { BookProvider } from "./providers/BookProvider";
// import Register from "./features/auth/Register";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotebookProvider>
          <BookProvider>
            <AppRouter />
          </BookProvider>
        </NotebookProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}