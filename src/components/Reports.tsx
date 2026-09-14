import { useState } from "react";
import { PageHeader, Card, Btn, StatCard, SectionTitle, PageLayout } from "./shared";
import { ConfirmModal } from "./Modal";
import { useToast } from "./Toast";

const monthlyRevenue = [
  { month: "Apr", rent: 78400, utilities: 8200 },
  { month: "May", rent: 80100, utilities: 8800 },
  { month: "Jun", rent: 82500, utilities: 9100 },
  { month: "Jul", rent: 83200, utilities: 10200 },
  { month: "Aug", rent: 85600, utilities: 9900 },
  { month: "Sep", rent: 87500, utilities: 9800 },
];
const maxTotal = Math.max(...monthlyRevenue.map((m) => m.rent + m.utilities));

const occupancyByProperty = [
  { property: "Greenview Apartments", jan: 91, feb: 91, mar: 95, apr: 95, may: 95, jun: 95, jul: 100, aug: 95, sep: 91 },
  { property: "Riverside Block B", jan: 75, feb: 81, mar: 87, apr: 87, may: 93, jun: 93, jul: 93, aug: 93, sep: 87 },
  { property: "Sunset Terrace", jan: 83, feb: 83, mar: 83, apr: 100, may: 100, jun: 100, jul: 100, aug: 100, sep: 83 },
];

const chargeBreakdown = [
  { label: "Base Rent", amount: 87500, pct: 89.9 },
  { label: "Electricity", amount: 4200, pct: 4.3 },
  { label: "Water", amount: 1850, pct: 1.9 },
  { label: "Parking", amount: 1600, pct: 1.6 },
  { label: "Wi-Fi", amount: 1960, pct: 2.0 },
  { label: "Other", amount: 190, pct: 0.2 },
];

type SavedReport = { name: string; type: string; generated: string };
const initialReports: SavedReport[] = [
  { name: "Revenue Summary (Sep 2026)", type: "Finance", generated: "Sep 01, 2026" },
  { name: "Occupancy Report Q3 2026", type: "Occupancy", generated: "Oct 01, 2026" },
  { name: "Tenant Ledger — All Tenants", type: "Ledger", generated: "Sep 01, 2026" },
  { name: "Deposit Liability Report", type: "Finance", generated: "Sep 01, 2026" },
  { name: "Overdue Payments Report", type: "Collections", generated: "Sep 02, 2026" },
];

const months9 = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep"] as const;
const months9Labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

export default function Reports() {
  const { toast } = useToast();
  const [activeReport, setActiveReport] = useState("revenue");
  const [savedReports, setSavedReports] = useState<SavedReport[]>(initialReports);
  const [confirmGenerate, setConfirmGenerate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SavedReport | null>(null);

  const generateReport = () => {
    const newReport: SavedReport = {
      name: `Revenue Summary (Oct 2026)`,
      type: "Finance",
      generated: "Oct 01, 2026",
    };
    setSavedReports([newReport, ...savedReports]);
    setConfirmGenerate(false);
    toast("Report generated and saved", "success");
  };

  const exportPDF = () => {
    toast("PDF export started — file will download shortly", "info");
    setTimeout(() => toast("revenue-report-sep-2026.pdf downloaded", "success"), 1500);
  };

  const viewReport = (r: SavedReport) => {
    toast(`Opening "${r.name}"…`, "info");
  };

  const downloadReport = (r: SavedReport) => {
    toast(`Downloading "${r.name}"…`, "info");
  };

  const deleteReport = () => {
    if (!deleteTarget) return;
    setSavedReports(savedReports.filter((r) => r !== deleteTarget));
    setDeleteTarget(null);
    toast("Report deleted", "info");
  };

  return (
    <PageLayout>
      <PageHeader
        title="Reports"
        subtitle="Financial and operational analytics"
        action={
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={exportPDF}>Export PDF</Btn>
            <Btn onClick={() => setConfirmGenerate(true)}>Generate Report</Btn>
          </div>
        }
      />

      <div className="flex gap-2 mb-5">
        {[{ id: "revenue", label: "Revenue" }, { id: "occupancy", label: "Occupancy" }, { id: "breakdown", label: "Charge Breakdown" }, { id: "saved", label: `Saved Reports (${savedReports.length})` }].map((r) => (
          <button key={r.id} onClick={() => setActiveReport(r.id)}
            style={{ padding: "5px 16px", borderRadius: "99px", border: "1px solid var(--border)", background: activeReport === r.id ? "var(--primary)" : "var(--card)", color: activeReport === r.id ? "white" : "var(--muted-foreground)", fontSize: "12px", fontFamily: "var(--font-mono)", cursor: "pointer", transition: "all 0.15s" }}>
            {r.label}
          </button>
        ))}
      </div>

      {activeReport === "revenue" && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <StatCard label="Sep Revenue" value="$97,300" sub="+4.2% vs Aug" accent />
            <StatCard label="YTD Revenue" value="$532,900" sub="Jan – Sep 2026" />
            <StatCard label="Avg Monthly" value="$89,150" sub="Past 6 months" />
          </div>
          <Card>
            <SectionTitle>Monthly Revenue — Apr to Sep 2026</SectionTitle>
            <div className="flex items-end gap-3" style={{ height: "200px" }}>
              {monthlyRevenue.map((m) => {
                const total = m.rent + m.utilities;
                const rentH = Math.round((m.rent / maxTotal) * 180);
                const utilH = Math.round((m.utilities / maxTotal) * 180);
                return (
                  <div key={m.month} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                    <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                      ${Math.round(total / 1000)}k
                    </div>
                    <div className="flex flex-col justify-end" style={{ height: "180px", gap: "1px" }}>
                      <div style={{ background: "var(--accent)", height: `${utilH}px`, borderRadius: "3px 3px 0 0", width: "100%", minWidth: "36px" }} />
                      <div style={{ background: "var(--primary)", height: `${rentH}px`, width: "100%", minWidth: "36px" }} />
                    </div>
                    <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)", marginTop: "4px" }}>{m.month}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-5 mt-4">
              {[["var(--primary)", "Base Rent"], ["var(--accent)", "Utilities"]].map(([bg, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: bg }} />
                  <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{label}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {activeReport === "occupancy" && (
        <Card>
          <SectionTitle>Occupancy Rate by Property — 2026</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "600px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Property</th>
                  {months9Labels.map((m) => (
                    <th key={m} style={{ textAlign: "center", padding: "8px 8px", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {occupancyByProperty.map((p) => (
                  <tr key={p.property} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 12px", fontSize: "13px" }}>{p.property}</td>
                    {months9.map((m) => {
                      const val = p[m];
                      const bg = val === 100 ? "#065F46" : val >= 90 ? "var(--primary)" : val >= 80 ? "#4ADE80" : "#FCD34D";
                      const color = val >= 90 ? "white" : val >= 80 ? "#065F46" : "#92400E";
                      return (
                        <td key={m} style={{ textAlign: "center", padding: "8px" }}>
                          <div style={{ background: bg, color, borderRadius: "4px", padding: "4px 0", fontSize: "12px", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                            {val}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeReport === "breakdown" && (
        <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <Card>
            <SectionTitle>Revenue Breakdown — Sep 2026</SectionTitle>
            <div className="flex flex-col gap-3">
              {chargeBreakdown.map((c) => (
                <div key={c.label}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: "13px" }}>{c.label}</span>
                    <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}>
                      ${c.amount.toLocaleString()} · {c.pct}%
                    </span>
                  </div>
                  <div style={{ background: "var(--muted)", height: "8px", borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{ background: c.label === "Base Rent" ? "var(--primary)" : "var(--accent)", height: "100%", width: `${c.pct}%`, borderRadius: "99px", transition: "width 0.4s" }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "16px" }}>$97,300</span>
            </div>
          </Card>
          <Card>
            <SectionTitle>Year-over-Year Comparison</SectionTitle>
            <div className="flex flex-col gap-3">
              {([["Total Revenue (Sep)", "$97,300", "$89,200", "+9.1%"], ["Occupancy Rate", "92.3%", "88.5%", "+3.8 pp"], ["Avg Rent per Room", "$1,900", "$1,750", "+8.6%"], ["Collections Rate", "87.5%", "83.2%", "+4.3 pp"], ["Utility Revenue", "$9,800", "$8,900", "+10.1%"]] as [string, string, string, string][]).map(([metric, y2026, y2025, change]) => (
                <div key={metric} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
                  <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "4px" }}>{metric}</div>
                  <div className="flex items-center gap-3">
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "15px" }}>{y2026}</span>
                    <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>vs {y2025}</span>
                    <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "#065F46", background: "#D1FAE5", padding: "1px 6px", borderRadius: "99px" }}>{change}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeReport === "saved" && (
        <Card>
          <SectionTitle>Saved & Generated Reports</SectionTitle>
          {savedReports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "var(--muted-foreground)", fontSize: "13px" }}>
              No reports yet. Click "Generate Report" to create one.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {savedReports.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--muted)" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500 }}>{r.name}</div>
                    <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)", marginTop: "2px" }}>{r.type} · Generated {r.generated}</div>
                  </div>
                  <div className="flex gap-2">
                    <Btn variant="secondary" size="sm" onClick={() => viewReport(r)}>View</Btn>
                    <Btn variant="ghost" size="sm" onClick={() => downloadReport(r)}>Download</Btn>
                    <Btn variant="ghost" size="sm" onClick={() => setDeleteTarget(r)}>Delete</Btn>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <ConfirmModal open={confirmGenerate} onClose={() => setConfirmGenerate(false)} onConfirm={generateReport}
        title="Generate Report"
        message="Generate a Revenue Summary report for October 2026? The report will be added to your Saved Reports." />

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteReport}
        title="Delete Report" danger confirmLabel="Delete"
        message={`Delete "${deleteTarget?.name}"? This action cannot be undone.`} />
    </PageLayout>
  );
}
