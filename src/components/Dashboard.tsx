import { StatCard, Card, SectionTitle, Badge, PageLayout } from "./shared";

const recentPayments = [
  { name: "Marcus Tran", room: "A-204", amount: "$1,850", date: "Sep 01, 2026", status: "paid" },
  { name: "Sophia Okonkwo", room: "B-103", amount: "$2,100", date: "Sep 01, 2026", status: "paid" },
  { name: "Liam Hartley", room: "A-301", amount: "$1,650", date: "Aug 31, 2026", status: "pending" },
  { name: "Yuki Nakamura", room: "C-205", amount: "$1,975", date: "Aug 30, 2026", status: "paid" },
  { name: "Daniel Ferreira", room: "B-207", amount: "$2,250", date: "Aug 29, 2026", status: "overdue" },
];

const alerts = [
  { type: "Contract Expiry", desc: "Room A-301 — Liam Hartley contract ends Oct 15, 2026", severity: "amber" },
  { type: "Overdue Payment", desc: "Room B-207 — Daniel Ferreira, 3 days overdue ($2,250)", severity: "red" },
  { type: "Deposit Refund", desc: "Room C-101 — Priya Mehta moved out, refund pending", severity: "blue" },
  { type: "Meter Reading", desc: "October readings due in 28 days for 3 properties", severity: "gray" },
];

const occupancy = [
  { property: "Greenview Apartments", total: 24, occupied: 22 },
  { property: "Riverside Block B", total: 16, occupied: 14 },
  { property: "Sunset Terrace", total: 12, occupied: 12 },
];

export default function Dashboard() {
  return (
    <PageLayout>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 600, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "3px" }}>
          Overview — September 2026
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 mb-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <StatCard label="Total Rooms" value="52" sub="Across 3 properties" accent />
        <StatCard label="Occupied" value="48" sub="92.3% occupancy rate" />
        <StatCard label="Revenue (Sep)" value="$91,200" sub="+4.2% vs last month" />
        <StatCard label="Outstanding" value="$5,350" sub="2 overdue, 1 pending" />
      </div>

      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "2fr 1fr" }}>
        {/* Recent Payments */}
        <Card>
          <SectionTitle>Recent Payments</SectionTitle>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Tenant", "Room", "Amount", "Date", "Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 10px", fontSize: "11px", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--muted-foreground)", fontWeight: 500, textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((p, i) => (
                <tr key={i} style={{ borderBottom: i < recentPayments.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "10px 10px", fontSize: "13px" }}>{p.name}</td>
                  <td style={{ padding: "10px 10px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}>{p.room}</td>
                  <td style={{ padding: "10px 10px", fontSize: "13px", fontFamily: "var(--font-mono)", fontWeight: 500 }}>{p.amount}</td>
                  <td style={{ padding: "10px 10px", fontSize: "12px", color: "var(--muted-foreground)" }}>{p.date}</td>
                  <td style={{ padding: "10px 10px" }}>
                    <Badge color={p.status === "paid" ? "green" : p.status === "pending" ? "amber" : "red"}>
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Alerts */}
        <Card>
          <SectionTitle>Alerts & Reminders</SectionTitle>
          <div className="flex flex-col gap-3">
            {alerts.map((a, i) => (
              <div key={i} style={{ padding: "12px", borderRadius: "var(--radius)", background: "var(--muted)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>{a.type}</span>
                  <Badge color={a.severity as any}>{a.severity}</Badge>
                </div>
                <p style={{ fontSize: "12px", color: "var(--muted-foreground)", lineHeight: 1.4 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Occupancy */}
      <Card>
        <SectionTitle>Property Occupancy</SectionTitle>
        <div className="flex flex-col gap-4">
          {occupancy.map((o, i) => {
            const pct = Math.round((o.occupied / o.total) * 100);
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{o.property}</span>
                  <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}>
                    {o.occupied}/{o.total} rooms · {pct}%
                  </span>
                </div>
                <div style={{ background: "var(--muted)", borderRadius: "99px", height: "8px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "99px",
                      width: `${pct}%`,
                      background: pct === 100 ? "var(--accent)" : "var(--primary)",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </PageLayout>
  );
}
