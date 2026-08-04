// ── Service Worker 註冊 ──
// 在瀏覽器端執行，註冊 sw.js

export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[Oasis] SW registered:", registration.scope);
      })
      .catch((err) => {
        console.warn("[Oasis] SW registration failed:", err);
      });
  });
}
