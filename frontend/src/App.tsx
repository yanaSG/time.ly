import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./providers/AuthProvider";
import { NotebookProvider } from "./providers/NotebookProvider";
import { BookProvider } from "./providers/BookProvider";
import { NotebookContentProvider } from "./providers/NotebookContentProvider";
// import Register from "./features/auth/Register";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotebookProvider>
          <NotebookContentProvider>
            <BookProvider>
              <AppRouter />
            </BookProvider>
          </NotebookContentProvider>
        </NotebookProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}