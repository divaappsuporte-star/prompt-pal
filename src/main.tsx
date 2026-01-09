import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";

// Auto-update PWA: check every 60 seconds and reload immediately when update available
const updateSW = registerSW({
  onNeedRefresh() {
    // New version available - reload immediately
    updateSW(true);
  },
  onOfflineReady() {
    console.log("Nutri21 pronto para uso offline");
  },
  // Check for updates every 60 seconds
  immediate: true,
});

// Also check for updates periodically
setInterval(() => {
  updateSW();
}, 60 * 1000);

createRoot(document.getElementById("root")!).render(<App />);
