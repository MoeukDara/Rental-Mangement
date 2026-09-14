import { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 600, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "3px" }}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px" }}
    >
      {children}
    </div>
  );
}

export function Badge({ children, color = "default" }: { children: ReactNode; color?: "default" | "green" | "amber" | "red" | "blue" | "gray" }) {
  const styles = {
    default: { background: "var(--muted)", color: "var(--muted-foreground)" },
    green: { background: "#D1FAE5", color: "#065F46" },
    amber: { background: "#FEF3C7", color: "#92400E" },
    red: { background: "#FEE2E2", color: "#991B1B" },
    blue: { background: "#DBEAFE", color: "#1E40AF" },
    gray: { background: "#F3F4F6", color: "#374151" },
  };
  return (
    <span
      style={{
        ...styles[color],
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        fontWeight: 500,
        padding: "2px 8px",
        borderRadius: "20px",
        letterSpacing: "0.03em",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function Btn({ children, onClick, variant = "primary", size = "md" }: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}) {
  const base = "inline-flex items-center gap-1.5 font-medium cursor-pointer transition-all duration-150 rounded";
  const variants = {
    primary: { background: "var(--primary)", color: "var(--primary-foreground)", border: "none" },
    secondary: { background: "var(--secondary)", color: "var(--secondary-foreground)", border: "1px solid var(--border)" },
    ghost: { background: "transparent", color: "var(--muted-foreground)", border: "1px solid var(--border)" },
  };
  const sizes = {
    sm: { fontSize: "12px", padding: "5px 12px" },
    md: { fontSize: "13px", padding: "7px 16px" },
  };
  return (
    <button
      className={base}
      onClick={onClick}
      style={{ ...variants[variant], ...sizes[size], fontFamily: "var(--font-body)" }}
    >
      {children}
    </button>
  );
}

export function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr style={{ borderBottom: "1px solid var(--border)" }}>
        {cols.map((c) => (
          <th
            key={c}
            style={{
              textAlign: "left",
              padding: "10px 14px",
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
              color: "var(--muted-foreground)",
              fontWeight: 500,
              textTransform: "uppercase",
              background: "var(--muted)",
            }}
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function Tr({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr
      style={{ borderBottom: "1px solid var(--border)", cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function Td({ children, mono = false }: { children: ReactNode; mono?: boolean }) {
  return (
    <td
      style={{
        padding: "11px 14px",
        fontSize: mono ? "12px" : "13px",
        fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
        color: "var(--card-foreground)",
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}

export function StatCard({ label, value, sub, accent = false }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div
      style={{
        background: accent ? "var(--primary)" : "var(--card)",
        border: accent ? "none" : "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "20px",
      }}
    >
      <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: accent ? "#A7D4B8" : "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: accent ? "white" : "var(--foreground)", letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "12px", color: accent ? "#A7D4B8" : "var(--muted-foreground)", marginTop: "6px" }}>{sub}</div>
      )}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, color: "var(--foreground)", marginBottom: "14px", letterSpacing: "-0.01em" }}>
      {children}
    </div>
  );
}

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: "28px 32px", minHeight: "100%" }}>
      {children}
    </div>
  );
}
