import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "info" | "error" | "warning";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  let nextId = 0;

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const icons = {
    success: "✓",
    info: "ℹ",
    warning: "⚠",
    error: "✕",
  };

  const colors = {
    success: { bg: "#D1FAE5", border: "#6EE7B7", text: "#065F46", icon: "#10B981" },
    info: { bg: "#DBEAFE", border: "#93C5FD", text: "#1E40AF", icon: "#3B82F6" },
    warning: { bg: "#FEF3C7", border: "#FCD34D", text: "#92400E", icon: "#F59E0B" },
    error: { bg: "#FEE2E2", border: "#FCA5A5", text: "#991B1B", icon: "#EF4444" },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", display: "flex", flexDirection: "column", gap: "10px", zIndex: 100, pointerEvents: "none" }}>
        {toasts.map((t) => {
          const c = colors[t.type];
          return (
            <div
              key={t.id}
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: "8px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                maxWidth: "360px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                animation: "slideIn 0.2s ease",
              }}
            >
              <span style={{ color: c.icon, fontSize: "16px", fontWeight: 700, flexShrink: 0 }}>{icons[t.type]}</span>
              <span style={{ fontSize: "13px", color: c.text, fontFamily: "var(--font-body)", lineHeight: 1.4 }}>{t.message}</span>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes slideIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform:none; } }`}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
