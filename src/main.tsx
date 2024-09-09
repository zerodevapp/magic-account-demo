import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Providers from "./Providers.tsx";
import App from "./App.tsx";
import "./index.css";
import "./polyfills.ts";
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
    <Analytics />
  </StrictMode>
);
