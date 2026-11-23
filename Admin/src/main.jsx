import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        {/* Hiển thị toàn bộ thông báo toast.success / toast.error trong ứng dụng */}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
