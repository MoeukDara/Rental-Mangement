import { useState } from "react";
import { PageHeader, Card, Badge, Btn, TableHead, Tr, Td, StatCard, PageLayout } from "./shared";
import { FormModal, ConfirmModal } from "./Modal";
import { useToast } from "./Toast";

type Payment = {
  id: string; invoice: string; tenant: string; room: string; amount: number;
  method: string; ref: string; date: string; status: string;
};

type Pending = {
  id: string; invoice: string; tenant: string; room: string; amount: number;
  due: string; daysPast: number; status: string;
};

const initialPayments: Payment[] = [
  { id: "PAY-2609-001", invoice: "INV-2609-001", tenant: "Marcus Tran", room: "A-204", amount: 2055, method: "Bank Transfer", ref: "BT-992834", date: "Sep 01, 2026", status: "confirmed" },
  { id: "PAY-2609-002", invoice: "INV-2609-002", tenant: "Sophia Okonkwo", room: "B-103", amount: 2272, method: "Credit Card", ref: "CC-441829", date: "Sep 01, 2026", status: "confirmed" },
  { id: "PAY-2609-004", invoice: "INV-2609-004", tenant: "Yuki Nakamura", room: "C-205", amount: 3122, method: "Bank Transfer", ref: "BT-886541", date: "Sep 02, 2026", status: "confirmed" },
  { id: "PAY-2609-006", invoice: "INV-2609-006", tenant: "Amara Diallo", room: "B-101", amount: 1350, method: "Cash", ref: "CSH-0021", date: "Sep 01, 2026", status: "confirmed" },
  { id: "PAY-2609-007", invoice: "INV-2609-007", tenant: "Priya Mehta", room: "C-102", amount: 2385, method: "Bank Transfer", ref: "BT-773290", date: "Sep 03, 2026", status: "confirmed" },
  { id: "PAY-2609-008", invoice: "INV-2609-008", tenant: "Elena Vasquez", room: "A-401", amount: 3808, method: "Standing Order", ref: "SO-EV2024", date: "Sep 01, 2026", status: "confirmed" },
  { id: "PAY-2608-005", invoice: "INV-2608-005", tenant: "Daniel Ferreira", room: "B-207", amount: 2250, method: "Bank Transfer", ref: "BT-664110", date: "Aug 06, 2026", status: "confirmed" },
];

const initialPending: Pending[] = [
  { id: "PAY-PEND-001", invoice: "INV-2609-003", tenant: "Liam Hartley", room: "A-301", amount: 2783, due: "Sep 05, 2026", daysPast: 0, status: "pending" },
  { id: "PAY-PEND-002", invoice: "INV-2609-005", tenant: "Daniel Ferreira", room: "B-207", amount: 2603, due: "Sep 05, 2026", daysPast: 3, status: "overdue" },
];

const methodColor: Record<string, "blue" | "green" | "gray" | "amber"> = {
  "Bank Transfer": "blue", "Credit Card": "green", "Cash": "amber", "Standing Order": "gray",
};

const blank = (keys: string[]) => Object.fromEntries(keys.map((k) => [k, ""]));

export default function Payments() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [pending, setPending] = useState<Pending[]>(initialPending);
  const [tab, setTab] = useState<"history" | "pending">("history");

  const [showRecord, setShowRecord] = useState(false);
  const [recordForm, setRecordForm] = useState(blank(["invoice", "tenant", "room", "amount", "method", "ref", "date"]));

  const [confirmReminder, setConfirmReminder] = useState<Pending | null>(null);

  const totalCollected = payments.reduce((a, p) => a + p.amount, 0);

  const recordPayment = () => {
    if (!recordForm.tenant.trim() || !recordForm.amount) { toast("Tenant and amount are required", "error"); return; }
    const newPayment: Payment = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      invoice: recordForm.invoice,
      tenant: recordForm.tenant,
      room: recordForm.room,
      amount: Number(recordForm.amount),
      method: recordForm.method || "Bank Transfer",
      ref: recordForm.ref || `REF-${Math.floor(Math.random() * 999999)}`,
      date: recordForm.date || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      status: "confirmed",
    };
    setPayments([newPayment, ...payments]);
    // Remove from pending if invoice matches
    setPending(pending.filter((p) => p.invoice !== recordForm.invoice));
    setShowRecord(false);
    setRecordForm(blank(["invoice", "tenant", "room", "amount", "method", "ref", "date"]));
    toast(`Payment of $${Number(recordForm.amount).toLocaleString()} recorded for ${recordForm.tenant}`, "success");
  };

  const recordFromPending = (p: Pending) => {
    setRecordForm({ invoice: p.invoice, tenant: p.tenant, room: p.room, amount: String(p.amount), method: "", ref: "", date: "" });
    setShowRecord(true);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Payments"
        subtitle="Payment history and outstanding balances"
        action={<Btn onClick={() => setShowRecord(true)}>Record Payment</Btn>}
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard label="This Month" value={`$${payments.filter((p) => p.date.includes("Sep")).reduce((a, p) => a + p.amount, 0).toLocaleString()}`} sub="Sep 2026 collected" accent />
        <StatCard label="Total Confirmed" value={`$${totalCollected.toLocaleString()}`} sub={`${payments.length} payments`} />
        <StatCard label="Pending" value={`$${pending.filter((p) => p.status === "pending").reduce((a, p) => a + p.amount, 0).toLocaleString()}`} sub="Awaiting payment" />
        <StatCard label="Overdue" value={`$${pending.filter((p) => p.status === "overdue").reduce((a, p) => a + p.amount, 0).toLocaleString()}`} sub="3+ days past due" />
      </div>

      <div className="flex gap-2 mb-4">
        {(["history", "pending"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "5px 16px", borderRadius: "99px", border: "1px solid var(--border)", background: tab === t ? "var(--primary)" : "var(--card)", color: tab === t ? "white" : "var(--muted-foreground)", fontSize: "12px", fontFamily: "var(--font-mono)", cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize" }}>
            {t === "history" ? "Payment History" : `Pending / Overdue ${pending.length > 0 ? `(${pending.length})` : ""}`}
          </button>
        ))}
      </div>

      {tab === "history" && (
        <Card>
          <table className="w-full">
            <TableHead cols={["Payment ID", "Invoice", "Tenant", "Room", "Amount", "Method", "Reference", "Date", "Status"]} />
            <tbody>
              {payments.map((p) => (
                <Tr key={p.id}>
                  <Td mono>{p.id}</Td>
                  <Td mono>{p.invoice}</Td>
                  <Td>{p.tenant}</Td>
                  <Td mono>{p.room}</Td>
                  <Td mono><strong>${p.amount.toLocaleString()}</strong></Td>
                  <Td><Badge color={methodColor[p.method] ?? "gray"}>{p.method}</Badge></Td>
                  <Td mono>{p.ref}</Td>
                  <Td>{p.date}</Td>
                  <Td><Badge color="green">{p.status}</Badge></Td>
                </Tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "pending" && (
        <Card>
          {pending.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", color: "var(--muted-foreground)" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>✓</div>
              <div style={{ fontSize: "14px", fontWeight: 500 }}>All payments are up to date</div>
            </div>
          ) : (
            <table className="w-full">
              <TableHead cols={["Payment ID", "Invoice", "Tenant", "Room", "Amount Due", "Due Date", "Days Past Due", "Status", ""]} />
              <tbody>
                {pending.map((p) => (
                  <Tr key={p.id}>
                    <Td mono>{p.id}</Td>
                    <Td mono>{p.invoice}</Td>
                    <Td>{p.tenant}</Td>
                    <Td mono>{p.room}</Td>
                    <Td mono><strong>${p.amount.toLocaleString()}</strong></Td>
                    <Td>{p.due}</Td>
                    <Td mono>{p.daysPast === 0 ? "—" : <span style={{ color: "#DC2626" }}>{p.daysPast} days</span>}</Td>
                    <Td><Badge color={p.status === "pending" ? "amber" : "red"}>{p.status}</Badge></Td>
                    <Td>
                      <div className="flex gap-1.5">
                        <Btn size="sm" onClick={() => recordFromPending(p)}>Record Payment</Btn>
                        <Btn variant="ghost" size="sm" onClick={() => setConfirmReminder(p)}>Send Reminder</Btn>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      <FormModal open={showRecord} onClose={() => setShowRecord(false)} title="Record Payment"
        fields={[
          { label: "Invoice Reference", name: "invoice", placeholder: "INV-2609-XXX" },
          { label: "Tenant Name", name: "tenant", required: true },
          { label: "Room", name: "room", placeholder: "e.g. A-204" },
          { label: "Amount ($)", name: "amount", type: "number" as const, required: true },
          { label: "Payment Method", name: "method", type: "select" as const, options: ["Bank Transfer", "Credit Card", "Cash", "Standing Order", "Cheque"] },
          { label: "Payment Reference / Receipt No.", name: "ref", placeholder: "e.g. BT-123456" },
          { label: "Payment Date", name: "date", placeholder: "e.g. Sep 05, 2026" },
        ]}
        values={recordForm} onChange={(n, v) => setRecordForm((f) => ({ ...f, [n]: v }))}
        onSubmit={recordPayment} submitLabel="Record Payment" />

      <ConfirmModal open={!!confirmReminder} onClose={() => setConfirmReminder(null)}
        onConfirm={() => { toast(`Payment reminder sent to ${confirmReminder?.tenant}`, "success"); setConfirmReminder(null); }}
        title="Send Payment Reminder"
        message={`Send a payment reminder to ${confirmReminder?.tenant} for invoice ${confirmReminder?.invoice}? Amount due: $${confirmReminder?.amount.toLocaleString()}, due ${confirmReminder?.due}.`}
        confirmLabel="Send Reminder" />
    </PageLayout>
  );
}
