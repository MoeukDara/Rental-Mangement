import { ReactNode, useEffect } from "react";
import { Btn } from "./shared";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export function Modal({ open, onClose, title, children, footer, width = "480px" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          width,
          maxWidth: "90vw",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)" }}
        >
          <h2
            style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "20px", color: "var(--muted-foreground)", cursor: "pointer", lineHeight: 1, padding: "0 4px" }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: "20px 22px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
        {footer && (
          <div
            className="flex justify-end gap-2"
            style={{ padding: "14px 22px", borderTop: "1px solid var(--border)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface Field {
  label: string;
  name: string;
  type?: "text" | "number" | "date" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: Field[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  submitLabel?: string;
}

export function FormModal({ open, onClose, title, fields, values, onChange, onSubmit, submitLabel = "Save" }: FormModalProps) {
  const inputStyle = {
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "8px 12px",
    fontSize: "13px",
    background: "var(--background)",
    color: "var(--foreground)",
    outline: "none",
    fontFamily: "var(--font-body)",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={onSubmit}>{submitLabel}</Btn>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
              {f.label}{f.required && <span style={{ color: "var(--accent)" }}> *</span>}
            </label>
            {f.type === "select" ? (
              <select value={values[f.name] ?? ""} onChange={(e) => onChange(f.name, e.target.value)} style={inputStyle}>
                <option value="">Select…</option>
                {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                rows={3}
                value={values[f.name] ?? ""}
                onChange={(e) => onChange(f.name, e.target.value)}
                placeholder={f.placeholder}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            ) : (
              <input
                type={f.type ?? "text"}
                value={values[f.name] ?? ""}
                onChange={(e) => onChange(f.name, e.target.value)}
                placeholder={f.placeholder}
                style={inputStyle}
              />
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", danger = false }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width="400px"
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <button
            onClick={onConfirm}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius)",
              border: "none",
              background: danger ? "#DC2626" : "var(--primary)",
              color: "white",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--foreground)" }}>{message}</p>
    </Modal>
  );
}
