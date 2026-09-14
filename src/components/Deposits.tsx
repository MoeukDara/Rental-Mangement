import { useState } from "react";
import { PageHeader, Card, Badge, Btn, TableHead, Tr, Td, StatCard, PageLayout } from "./shared";
import { FormModal, ConfirmModal, Modal } from "./Modal";
import { useToast } from "./Toast";

type Deposit = {
  id: string; tenant: string; room: string; property: string; amount: number;
  paid: string; heldSince: string; interest: number; totalOwed: number; status: string;
  notes?: string;
};

const initialDeposits: Deposit[] = [
  { id: "DEP-001", tenant: "Marcus Tran", room: "A-204", property: "Greenview Apartments", amount: 3700, paid: "Mar 15, 2024", heldSince: "2 yrs 5 mo", interest: 74, totalOwed: 3774, status: "held" },
  { id: "DEP-002", tenant: "Sophia Okonkwo", room: "B-103", property: "Riverside Block B", amount: 4200, paid: "Jan 01, 2025", heldSince: "8 mo", interest: 21, totalOwed: 4221, status: "held" },
  { id: "DEP-003", tenant: "Liam Hartley", room: "A-301", property: "Greenview Apartments", amount: 4800, paid: "Oct 01, 2023", heldSince: "2 yrs 11 mo", interest: 144, totalOwed: 4944, status: "held" },
  { id: "DEP-004", tenant: "Yuki Nakamura", room: "C-205", property: "Sunset Terrace", amount: 5600, paid: "Jun 15, 2024", heldSince: "1 yr 2 mo", interest: 67, totalOwed: 5667, status: "held" },
  { id: "DEP-005", tenant: "Daniel Ferreira", room: "B-207", property: "Riverside Block B", amount: 4500, paid: "May 01, 2024", heldSince: "1 yr 4 mo", interest: 54, totalOwed: 4554, status: "dispute" },
  { id: "DEP-006", tenant: "Amara Diallo", room: "B-101", property: "Riverside Block B", amount: 2700, paid: "Feb 01, 2025", heldSince: "7 mo", interest: 13, totalOwed: 2713, status: "held" },
  { id: "DEP-007", tenant: "Priya Mehta", room: "C-102", property: "Sunset Terrace", amount: 4100, paid: "Aug 01, 2023", heldSince: "(moved out)", interest: 123, totalOwed: 4223, status: "refund-pending" },
  { id: "DEP-008", tenant: "Elena Vasquez", room: "A-401", property: "Greenview Apartments", amount: 6400, paid: "Nov 01, 2022", heldSince: "3 yrs 10 mo", interest: 256, totalOwed: 6656, status: "held" },
];

const statusColor: Record<string, "green" | "amber" | "red" | "blue" | "gray"> = {
  held: "green", "refund-pending": "amber", dispute: "red", refunded: "gray",
};

const blank = (keys: string[]) => Object.fromEntries(keys.map((k) => [k, ""]));

export default function Deposits() {
  const { toast } = useToast();
  const [deposits, setDeposits] = useState<Deposit[]>(initialDeposits);
  const [selected, setSelected] = useState<Deposit | null>(null);
  const [showRecord, setShowRecord] = useState(false);
  const [recordForm, setRecordForm] = useState(blank(["tenant", "room", "property", "amount", "paid"]));
  const [confirmRefund, setConfirmRefund] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const totalHeld = deposits.filter((d) => d.status === "held").reduce((a, d) => a + d.amount, 0);
  const totalInterest = deposits.reduce((a, d) => a + d.interest, 0);

  const recordDeposit = () => {
    if (!recordForm.tenant.trim()) { toast("Tenant name is required", "error"); return; }
    const amt = Number(recordForm.amount) || 0;
    const d: Deposit = {
      id: `DEP-00${deposits.length + 1}`,
      tenant: recordForm.tenant, room: recordForm.room, property: recordForm.property,
      amount: amt, paid: recordForm.paid || "Sep 2026",
      heldSince: "0 mo", interest: 0, totalOwed: amt, status: "held",
    };
    setDeposits([...deposits, d]);
    setShowRecord(false);
    setRecordForm(blank(["tenant", "room", "property", "amount", "paid"]));
    toast(`Deposit recorded for ${d.tenant}`, "success");
  };

  const processRefund = () => {
    if (!selected) return;
    const updated: Deposit = { ...selected, status: "refunded", totalOwed: 0 };
    setDeposits(deposits.map((d) => d.id === selected.id ? updated : d));
    setSelected(updated);
    setConfirmRefund(false);
    toast(`Refund of $${selected.totalOwed.toLocaleString()} processed for ${selected.tenant}`, "success");
  };

  const saveNote = () => {
    if (!selected || !noteText.trim()) return;
    const updated: Deposit = { ...selected, notes: noteText };
    setDeposits(deposits.map((d) => d.id === selected.id ? updated : d));
    setSelected(updated);
    setShowNote(false);
    setNoteText("");
    toast("Note added to deposit record", "success");
  };

  return (
    <PageLayout>
      <PageHeader
        title="Deposits"
        subtitle="Security deposits held and their status"
        action={<Btn onClick={() => setShowRecord(true)}>Record Deposit</Btn>}
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Held" value={`$${totalHeld.toLocaleString()}`} sub="Active deposits" accent />
        <StatCard label="Deposits" value={`${deposits.filter((d) => d.status === "held").length}`} sub="Currently held" />
        <StatCard label="Accrued Interest" value={`$${totalInterest.toLocaleString()}`} sub="1% annual rate" />
        <StatCard label="Pending Refunds" value={`${deposits.filter((d) => d.status === "refund-pending").length}`} sub="Awaiting processing" />
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: selected ? "1fr 300px" : "1fr" }}>
        <Card>
          <table className="w-full">
            <TableHead cols={["ID", "Tenant", "Room", "Amount Paid", "Date Paid", "Held For", "Interest", "Total Owed", "Status"]} />
            <tbody>
              {deposits.map((d) => (
                <Tr key={d.id} onClick={() => setSelected(selected?.id === d.id ? null : d)}>
                  <Td mono>{d.id}</Td>
                  <Td>{d.tenant}</Td>
                  <Td mono>{d.room}</Td>
                  <Td mono>${d.amount.toLocaleString()}</Td>
                  <Td>{d.paid}</Td>
                  <Td mono>{d.heldSince}</Td>
                  <Td mono>+${d.interest}</Td>
                  <Td mono><strong>${d.totalOwed.toLocaleString()}</strong></Td>
                  <Td><Badge color={statusColor[d.status] as any}>{d.status}</Badge></Td>
                </Tr>
              ))}
            </tbody>
          </table>
        </Card>

        {selected && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 600 }}>Deposit Detail</div>
              <button onClick={() => setSelected(null)} style={{ fontSize: "18px", color: "var(--muted-foreground)", background: "none", border: "none", cursor: "pointer" }}>×</button>
            </div>
            <div className="flex flex-col gap-3 mb-4">
              {([["Reference", selected.id], ["Tenant", selected.tenant], ["Room", `${selected.room} · ${selected.property}`], ["Deposit Amount", `$${selected.amount.toLocaleString()}`], ["Date Paid", selected.paid], ["Held For", selected.heldSince], ["Accrued Interest", `$${selected.interest}`], ["Total Owed", `$${selected.totalOwed.toLocaleString()}`], ["Status", selected.status]] as [string, string][]).map(([label, value]) => (
                <div key={label} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
                  <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "2px" }}>{label}</div>
                  <div style={{ fontSize: "13px", fontWeight: label === "Total Owed" || label === "Deposit Amount" ? 600 : 400 }}>{value}</div>
                </div>
              ))}
              {selected.notes && (
                <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
                  <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "2px" }}>Notes</div>
                  <div style={{ fontSize: "12px", color: "var(--foreground)", lineHeight: 1.5 }}>{selected.notes}</div>
                </div>
              )}
            </div>
            {selected.status === "refund-pending" && (
              <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "var(--radius)", padding: "10px 12px", marginBottom: "14px", fontSize: "12px", color: "#92400E" }}>
                Refund pending — inspection complete, deductions: $0
              </div>
            )}
            {selected.status === "dispute" && (
              <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "var(--radius)", padding: "10px 12px", marginBottom: "14px", fontSize: "12px", color: "#991B1B" }}>
                In dispute — tenant claims damage deductions are excessive
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {(selected.status === "refund-pending" || selected.status === "held") && (
                <Btn size="sm" onClick={() => setConfirmRefund(true)}>Process Refund</Btn>
              )}
              <Btn variant="secondary" size="sm" onClick={() => { setNoteText(selected.notes || ""); setShowNote(true); }}>Add Note</Btn>
              <Btn variant="ghost" size="sm" onClick={() => setShowHistory(true)}>History</Btn>
            </div>
          </Card>
        )}
      </div>

      <FormModal open={showRecord} onClose={() => setShowRecord(false)} title="Record Security Deposit"
        fields={[
          { label: "Tenant Name", name: "tenant", required: true },
          { label: "Room", name: "room", placeholder: "e.g. A-204" },
          { label: "Property", name: "property", type: "select" as const, options: ["Greenview Apartments", "Riverside Block B", "Sunset Terrace"] },
          { label: "Deposit Amount ($)", name: "amount", type: "number" as const, required: true },
          { label: "Date Received", name: "paid", placeholder: "e.g. Sep 15, 2026" },
        ]}
        values={recordForm} onChange={(n, v) => setRecordForm((f) => ({ ...f, [n]: v }))}
        onSubmit={recordDeposit} submitLabel="Record Deposit" />

      <ConfirmModal open={confirmRefund} onClose={() => setConfirmRefund(false)} onConfirm={processRefund}
        title="Process Refund"
        message={`Process full refund of $${selected?.totalOwed.toLocaleString()} (including $${selected?.interest} interest) to ${selected?.tenant}?`}
        confirmLabel="Process Refund" />

      <Modal open={showNote} onClose={() => setShowNote(false)} title="Add Note" width="400px"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setShowNote(false)}>Cancel</Btn>
            <Btn onClick={saveNote}>Save Note</Btn>
          </>
        }>
        <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={4} placeholder="Enter note…"
          style={{ width: "100%", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "10px", fontSize: "13px", background: "var(--background)", color: "var(--foreground)", outline: "none", fontFamily: "var(--font-body)", resize: "vertical" }} />
      </Modal>

      <Modal open={showHistory} onClose={() => setShowHistory(false)} title={`Deposit History — ${selected?.id}`} width="420px">
        <div className="flex flex-col gap-3">
          {[
            { date: selected?.paid ?? "", action: "Deposit received", amount: `+$${selected?.amount.toLocaleString()}` },
            { date: "Monthly", action: "Interest accrued (1% pa)", amount: `+$${selected?.interest ?? 0}` },
          ].map((h, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500 }}>{h.action}</div>
                <div style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{h.date}</div>
              </div>
              <div style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color: "#065F46", fontWeight: 600 }}>{h.amount}</div>
            </div>
          ))}
        </div>
      </Modal>
    </PageLayout>
  );
}
