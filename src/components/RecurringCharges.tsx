import { useState } from "react";
import { PageHeader, Card, Badge, Btn, SectionTitle, TableHead, Tr, Td, PageLayout } from "./shared";
import { FormModal, ConfirmModal } from "./Modal";
import { useToast } from "./Toast";

type Reading = { room: string; tenant: string; prev: number; current: number; units: number; amount: number };
type Category = { id: string; label: string; icon: string; billingMethod: string; ratePerUnit: string; rate: number; readings: Reading[] };

const initialCategories: Category[] = [
  {
    id: "water", label: "Water", icon: "💧", billingMethod: "By meter reading", ratePerUnit: "$0.85 / m³", rate: 0.85,
    readings: [
      { room: "A-204", tenant: "Marcus Tran", prev: 1420, current: 1473, units: 53, amount: 45 },
      { room: "B-103", tenant: "Sophia Okonkwo", prev: 2310, current: 2371, units: 61, amount: 52 },
      { room: "A-301", tenant: "Liam Hartley", prev: 3180, current: 3260, units: 80, amount: 68 },
      { room: "C-205", tenant: "Yuki Nakamura", prev: 1805, current: 1890, units: 85, amount: 72 },
    ],
  },
  {
    id: "electricity", label: "Electricity", icon: "⚡", billingMethod: "By meter reading", ratePerUnit: "$0.14 / kWh", rate: 0.14,
    readings: [
      { room: "A-204", tenant: "Marcus Tran", prev: 12450, current: 13307, units: 857, amount: 120 },
      { room: "A-301", tenant: "Liam Hartley", prev: 28600, current: 29993, units: 1393, amount: 195 },
      { room: "C-205", tenant: "Yuki Nakamura", prev: 9100, current: 10600, units: 1500, amount: 210 },
      { room: "B-207", tenant: "Daniel Ferreira", prev: 15200, current: 16450, units: 1250, amount: 175 },
    ],
  },
  {
    id: "wifi", label: "Wi-Fi", icon: "📡", billingMethod: "Fixed monthly", ratePerUnit: "$40 / month", rate: 40,
    readings: [
      { room: "A-204", tenant: "Marcus Tran", prev: 0, current: 0, units: 1, amount: 40 },
      { room: "B-103", tenant: "Sophia Okonkwo", prev: 0, current: 0, units: 1, amount: 40 },
      { room: "A-301", tenant: "Liam Hartley", prev: 0, current: 0, units: 1, amount: 40 },
      { room: "C-205", tenant: "Yuki Nakamura", prev: 0, current: 0, units: 1, amount: 40 },
      { room: "B-207", tenant: "Daniel Ferreira", prev: 0, current: 0, units: 1, amount: 40 },
    ],
  },
  {
    id: "parking", label: "Parking", icon: "🚗", billingMethod: "Fixed monthly per bay", ratePerUnit: "$80 / bay / month", rate: 80,
    readings: [
      { room: "B-103", tenant: "Sophia Okonkwo", prev: 0, current: 0, units: 1, amount: 80 },
      { room: "A-301", tenant: "Liam Hartley", prev: 0, current: 0, units: 1, amount: 80 },
      { room: "B-207", tenant: "Daniel Ferreira", prev: 0, current: 0, units: 1, amount: 80 },
      { room: "C-102", tenant: "Priya Mehta", prev: 0, current: 0, units: 1, amount: 80 },
      { room: "A-401", tenant: "Elena Vasquez", prev: 0, current: 0, units: 2, amount: 160 },
    ],
  },
];

type RateRow = { service: string; catId: string; rate: string; period: string; method: string };
const initialRates: RateRow[] = [
  { service: "Water", catId: "water", rate: "$0.85 / m³", period: "Monthly", method: "Meter reading" },
  { service: "Electricity", catId: "electricity", rate: "$0.14 / kWh", period: "Monthly", method: "Meter reading" },
  { service: "Wi-Fi", catId: "wifi", rate: "$40.00 flat", period: "Monthly", method: "Fixed per unit" },
  { service: "Parking (single)", catId: "parking", rate: "$80.00 flat", period: "Monthly", method: "Fixed per bay" },
  { service: "Parking (double)", catId: "parking", rate: "$160.00 flat", period: "Monthly", method: "Fixed per 2 bays" },
];

export default function RecurringCharges() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [rates, setRates] = useState<RateRow[]>(initialRates);
  const [tab, setTab] = useState("water");
  const [pendingCurrents, setPendingCurrents] = useState<Record<string, number>>({});

  const [editRateTarget, setEditRateTarget] = useState<RateRow | null>(null);
  const [editRateForm, setEditRateForm] = useState<Record<string, string>>({});

  const [showAddReading, setShowAddReading] = useState(false);
  const [addReadingForm, setAddReadingForm] = useState<Record<string, string>>({ room: "", tenant: "", prev: "", current: "" });

  const [confirmSave, setConfirmSave] = useState(false);

  const active = categories.find((c) => c.id === tab)!;
  const isMeter = active.billingMethod.includes("meter");

  const handleCurrentChange = (room: string, val: number) => {
    setPendingCurrents((p) => ({ ...p, [`${tab}-${room}`]: val }));
  };

  const getCurrentVal = (r: Reading) => {
    const k = `${tab}-${r.room}`;
    return pendingCurrents[k] ?? r.current;
  };

  const saveReadings = () => {
    const updated = categories.map((cat) =>
      cat.id === tab
        ? {
            ...cat,
            readings: cat.readings.map((r) => {
              const key = `${tab}-${r.room}`;
              if (!(key in pendingCurrents)) return r;
              const newCurrent = pendingCurrents[key];
              const units = Math.max(0, newCurrent - r.prev);
              const amount = Math.round(units * cat.rate);
              return { ...r, current: newCurrent, units, amount };
            }),
          }
        : cat
    );
    setCategories(updated);
    setPendingCurrents((p) => {
      const next = { ...p };
      Object.keys(next).filter((k) => k.startsWith(tab + "-")).forEach((k) => delete next[k]);
      return next;
    });
    setConfirmSave(false);
    toast(`${active.label} readings saved for Sep 2026`, "success");
  };

  const hasPending = Object.keys(pendingCurrents).some((k) => k.startsWith(tab + "-"));

  const saveEditRate = () => {
    if (!editRateTarget) return;
    setRates(rates.map((r) => r.service === editRateTarget.service ? { ...r, rate: editRateForm.rate, method: editRateForm.method, period: editRateForm.period } : r));
    setEditRateTarget(null);
    toast(`Rate for ${editRateTarget.service} updated`, "success");
  };

  const addReading = () => {
    if (!addReadingForm.room) { toast("Room is required", "error"); return; }
    const prev = Number(addReadingForm.prev) || 0;
    const current = Number(addReadingForm.current) || 0;
    const units = Math.max(0, current - prev);
    const amount = Math.round(units * active.rate);
    const newRow: Reading = { room: addReadingForm.room, tenant: addReadingForm.tenant, prev, current, units, amount };
    setCategories(categories.map((cat) => cat.id === tab ? { ...cat, readings: [...cat.readings, newRow] } : cat));
    setShowAddReading(false);
    setAddReadingForm({ room: "", tenant: "", prev: "", current: "" });
    toast(`Reading added for ${newRow.room}`, "success");
  };

  return (
    <PageLayout>
      <PageHeader
        title="Recurring Charges"
        subtitle="Configure utility rates and enter monthly readings"
        action={
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={() => setShowAddReading(true)}>Add Reading</Btn>
            {hasPending && <Btn onClick={() => setConfirmSave(true)}>Save Readings</Btn>}
          </div>
        }
      />

      {/* Rates overview */}
      <Card className="mb-5">
        <SectionTitle>Service Rates</SectionTitle>
        <table className="w-full">
          <TableHead cols={["Service", "Rate", "Billing Period", "Method", ""]} />
          <tbody>
            {rates.map((r) => (
              <Tr key={r.service}>
                <Td>{r.service}</Td>
                <Td mono>{r.rate}</Td>
                <Td>{r.period}</Td>
                <Td>{r.method}</Td>
                <Td>
                  <Btn variant="ghost" size="sm" onClick={() => { setEditRateTarget(r); setEditRateForm({ rate: r.rate, period: r.period, method: r.method }); }}>
                    Edit Rate
                  </Btn>
                </Td>
              </Tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {categories.map((c) => (
          <button key={c.id} onClick={() => setTab(c.id)}
            style={{ padding: "6px 16px", borderRadius: "99px", border: "1px solid var(--border)", background: tab === c.id ? "var(--primary)" : "var(--card)", color: tab === c.id ? "white" : "var(--muted-foreground)", fontSize: "12px", fontFamily: "var(--font-mono)", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "6px" }}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <SectionTitle>{active.icon} {active.label} — September 2026</SectionTitle>
            <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "-10px", fontFamily: "var(--font-mono)" }}>
              {active.billingMethod} · {active.ratePerUnit}
            </div>
          </div>
          <div className="flex gap-2">
            {hasPending && (
              <span style={{ fontSize: "12px", color: "var(--accent)", fontFamily: "var(--font-mono)", alignSelf: "center" }}>
                Unsaved changes
              </span>
            )}
            <Btn variant="secondary" size="sm" onClick={() => { toast("Import feature: upload a CSV with room, prev, current columns", "info"); }}>
              Import Readings
            </Btn>
          </div>
        </div>
        <table className="w-full">
          <TableHead cols={isMeter ? ["Room", "Tenant", "Prev Reading", "Current Reading", "Units Used", "Amount"] : ["Room", "Tenant", "Units / Bays", "Monthly Amount", ""]} />
          <tbody>
            {active.readings.map((r, i) => (
              <Tr key={i}>
                <Td mono>{r.room}</Td>
                <Td>{r.tenant}</Td>
                {isMeter ? (
                  <>
                    <Td mono>{r.prev.toLocaleString()}</Td>
                    <Td mono>
                      <input
                        type="number"
                        value={getCurrentVal(r)}
                        onChange={(e) => handleCurrentChange(r.room, Number(e.target.value))}
                        style={{ width: "90px", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 8px", fontFamily: "var(--font-mono)", fontSize: "12px", background: "var(--background)", color: "var(--foreground)", outline: "none" }}
                      />
                    </Td>
                    <Td mono>
                      {isMeter ? Math.max(0, getCurrentVal(r) - r.prev) : r.units}
                    </Td>
                  </>
                ) : (
                  <Td mono>{r.units}</Td>
                )}
                <Td mono>
                  <strong>
                    ${isMeter ? Math.round(Math.max(0, getCurrentVal(r) - r.prev) * active.rate) : r.amount}
                  </strong>
                </Td>
              </Tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: "2px solid var(--border)" }}>
              <td colSpan={isMeter ? 5 : 3} style={{ padding: "10px 14px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Total
              </td>
              <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700 }}>
                ${active.readings.reduce((a, r) => {
                  if (isMeter) return a + Math.round(Math.max(0, getCurrentVal(r) - r.prev) * active.rate);
                  return a + r.amount;
                }, 0).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </Card>

      {/* Edit Rate Modal */}
      <FormModal open={!!editRateTarget} onClose={() => setEditRateTarget(null)} title={`Edit Rate — ${editRateTarget?.service}`}
        fields={[
          { label: "Rate", name: "rate", placeholder: "e.g. $0.90 / m³" },
          { label: "Billing Period", name: "period", type: "select" as const, options: ["Monthly", "Quarterly", "Annual"] },
          { label: "Method", name: "method", placeholder: "e.g. Meter reading" },
        ]}
        values={editRateForm} onChange={(n, v) => setEditRateForm((f) => ({ ...f, [n]: v }))}
        onSubmit={saveEditRate} submitLabel="Update Rate" />

      {/* Add Reading Modal */}
      <FormModal open={showAddReading} onClose={() => setShowAddReading(false)} title={`Add ${active.label} Reading`}
        fields={[
          { label: "Room", name: "room", placeholder: "e.g. A-204", required: true },
          { label: "Tenant", name: "tenant", placeholder: "Tenant name" },
          ...(isMeter ? [
            { label: "Previous Reading", name: "prev", type: "number" as const },
            { label: "Current Reading", name: "current", type: "number" as const },
          ] : [
            { label: "Units", name: "current", type: "number" as const, placeholder: "1" },
          ]),
        ]}
        values={addReadingForm} onChange={(n, v) => setAddReadingForm((f) => ({ ...f, [n]: v }))}
        onSubmit={addReading} submitLabel="Add Reading" />

      <ConfirmModal open={confirmSave} onClose={() => setConfirmSave(false)} onConfirm={saveReadings}
        title="Save Meter Readings"
        message={`Save updated ${active.label} readings for September 2026? This will recalculate charges for all affected tenants.`}
        confirmLabel="Save Readings" />
    </PageLayout>
  );
}
