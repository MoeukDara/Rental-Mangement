import { useState } from "react";
import { PageHeader, Card, Badge, Btn, TableHead, Tr, Td, PageLayout } from "./shared";
import { FormModal, ConfirmModal } from "./Modal";
import { useToast } from "./Toast";

type Tenant = {
  id: string; name: string; phone: string; email: string; room: string; property: string;
  since: string; lease: string; deposit: number; status: string; emergencyContact: string;
};

const initialTenants: Tenant[] = [
  { id: "T-001", name: "Marcus Tran", phone: "+1 555 0142", email: "m.tran@email.com", room: "A-204", property: "Greenview Apartments", since: "Mar 2024", lease: "Mar 2027", deposit: 3700, status: "active", emergencyContact: "Lisa Tran +1 555 0199" },
  { id: "T-002", name: "Sophia Okonkwo", phone: "+1 555 0381", email: "s.okonkwo@email.com", room: "B-103", property: "Riverside Block B", since: "Jan 2025", lease: "Jan 2026", deposit: 4200, status: "active", emergencyContact: "Felix Okonkwo +1 555 0382" },
  { id: "T-003", name: "Liam Hartley", phone: "+1 555 0547", email: "l.hartley@email.com", room: "A-301", property: "Greenview Apartments", since: "Oct 2023", lease: "Oct 2026", deposit: 4800, status: "active", emergencyContact: "Susan Hartley +1 555 0548" },
  { id: "T-004", name: "Yuki Nakamura", phone: "+1 555 0776", email: "y.nakamura@email.com", room: "C-205", property: "Sunset Terrace", since: "Jun 2024", lease: "Jun 2026", deposit: 5600, status: "active", emergencyContact: "Kenji Nakamura +81 90 1234 5678" },
  { id: "T-005", name: "Daniel Ferreira", phone: "+1 555 0993", email: "d.ferreira@email.com", room: "B-207", property: "Riverside Block B", since: "May 2024", lease: "May 2026", deposit: 4500, status: "overdue", emergencyContact: "Ana Ferreira +55 11 9999 0001" },
  { id: "T-006", name: "Amara Diallo", phone: "+1 555 0211", email: "a.diallo@email.com", room: "B-101", property: "Riverside Block B", since: "Feb 2025", lease: "Feb 2027", deposit: 2700, status: "active", emergencyContact: "Kofi Diallo +1 555 0212" },
  { id: "T-007", name: "Priya Mehta", phone: "+1 555 0618", email: "p.mehta@email.com", room: "C-102", property: "Sunset Terrace", since: "Aug 2023", lease: "Aug 2026", deposit: 4100, status: "active", emergencyContact: "Raj Mehta +1 555 0619" },
  { id: "T-008", name: "Elena Vasquez", phone: "+1 555 0834", email: "e.vasquez@email.com", room: "A-401", property: "Greenview Apartments", since: "Nov 2022", lease: "Nov 2026", deposit: 6400, status: "active", emergencyContact: "Luis Vasquez +1 555 0835" },
];

const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2);
const colors = ["#1A6B4A", "#C8873A", "#2563EB", "#7C3AED", "#DC2626", "#059669"];
const blank = (keys: string[]) => Object.fromEntries(keys.map((k) => [k, ""]));
const fields = [
  { label: "Full Name", name: "name", required: true },
  { label: "Email", name: "email", placeholder: "tenant@email.com" },
  { label: "Phone", name: "phone", placeholder: "+1 555 0000" },
  { label: "Room", name: "room", placeholder: "e.g. A-205" },
  { label: "Property", name: "property", type: "select" as const, options: ["Greenview Apartments", "Riverside Block B", "Sunset Terrace"] },
  { label: "Tenant Since", name: "since", placeholder: "e.g. Oct 2025" },
  { label: "Lease End", name: "lease", placeholder: "e.g. Oct 2027" },
  { label: "Deposit ($)", name: "deposit", type: "number" as const },
  { label: "Emergency Contact", name: "emergencyContact", placeholder: "Name + phone" },
];

export default function Tenants() {
  const { toast } = useToast();
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [selected, setSelected] = useState<Tenant | null>(null);
  const [search, setSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(blank(fields.map((f) => f.name)));

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const [confirmRemove, setConfirmRemove] = useState(false);

  const filtered = tenants.filter((t) =>
    [t.name, t.room, t.email, t.property].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  const addTenant = () => {
    if (!addForm.name.trim()) { toast("Full name is required", "error"); return; }
    const newTenant: Tenant = {
      id: `T-00${tenants.length + 1}`,
      name: addForm.name,
      phone: addForm.phone,
      email: addForm.email,
      room: addForm.room,
      property: addForm.property,
      since: addForm.since,
      lease: addForm.lease,
      deposit: Number(addForm.deposit) || 0,
      status: "active",
      emergencyContact: addForm.emergencyContact,
    };
    setTenants([...tenants, newTenant]);
    setShowAdd(false);
    setAddForm(blank(fields.map((f) => f.name)));
    toast(`Tenant "${newTenant.name}" added`, "success");
  };

  const openEdit = () => {
    if (!selected) return;
    setEditForm({
      name: selected.name, phone: selected.phone, email: selected.email,
      room: selected.room, property: selected.property, since: selected.since,
      lease: selected.lease, deposit: String(selected.deposit), emergencyContact: selected.emergencyContact,
    });
    setShowEdit(true);
  };

  const saveEdit = () => {
    if (!selected) return;
    const updated: Tenant = { ...selected, ...editForm, deposit: Number(editForm.deposit) };
    setTenants(tenants.map((t) => t.id === selected.id ? updated : t));
    setSelected(updated);
    setShowEdit(false);
    toast("Tenant profile updated", "success");
  };

  const removeTenant = () => {
    if (!selected) return;
    setTenants(tenants.filter((t) => t.id !== selected.id));
    setSelected(null);
    setConfirmRemove(false);
    toast("Tenant record removed", "info");
  };

  return (
    <PageLayout>
      <PageHeader
        title="Tenant Management"
        subtitle={`${tenants.length} tenants across all properties`}
        action={<Btn onClick={() => setShowAdd(true)}>+ Add Tenant</Btn>}
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: selected ? "1fr 300px" : "1fr" }}>
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, room, email, property…"
              style={{ flex: 1, border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "8px 12px", fontSize: "13px", background: "var(--muted)", color: "var(--foreground)", outline: "none", fontFamily: "var(--font-body)" }}
            />
          </div>
          <table className="w-full">
            <TableHead cols={["#", "Tenant", "Room", "Property", "Lease End", "Deposit", "Status"]} />
            <tbody>
              {filtered.map((t, i) => (
                <Tr key={t.id} onClick={() => setSelected(selected?.id === t.id ? null : t)}>
                  <Td mono>{t.id}</Td>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
                        style={{ background: colors[i % colors.length], color: "white", fontFamily: "var(--font-mono)" }}>
                        {initials(t.name)}
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 500 }}>{t.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{t.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td mono>{t.room}</Td>
                  <Td>{t.property}</Td>
                  <Td mono>{t.lease}</Td>
                  <Td mono>${t.deposit.toLocaleString()}</Td>
                  <Td><Badge color={t.status === "active" ? "green" : "red"}>{t.status}</Badge></Td>
                </Tr>
              ))}
            </tbody>
          </table>
        </Card>

        {selected && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600 }}>Tenant Profile</div>
              <button onClick={() => setSelected(null)} style={{ fontSize: "18px", color: "var(--muted-foreground)", background: "none", border: "none", cursor: "pointer" }}>×</button>
            </div>
            <div className="flex flex-col items-center mb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-3"
                style={{ background: "var(--primary)", color: "white", fontFamily: "var(--font-display)" }}>
                {initials(selected.name)}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, textAlign: "center" }}>{selected.name}</div>
              <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px", fontFamily: "var(--font-mono)" }}>{selected.id}</div>
            </div>
            <div className="flex flex-col gap-3">
              {([["Room", `${selected.room} · ${selected.property}`], ["Phone", selected.phone], ["Email", selected.email], ["Tenant Since", selected.since], ["Lease End", selected.lease], ["Deposit Held", `$${selected.deposit.toLocaleString()}`], ["Emergency Contact", selected.emergencyContact]] as [string, string][]).map(([label, value]) => (
                <div key={label} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
                  <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "2px" }}>{label}</div>
                  <div style={{ fontSize: "13px" }}>{value}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Btn variant="secondary" size="sm" onClick={openEdit}>Edit</Btn>
              <Btn variant="ghost" size="sm" onClick={() => { toast(`Email sent to ${selected.name}`, "info"); }}>Send Email</Btn>
              <Btn variant="ghost" size="sm" onClick={() => setConfirmRemove(true)}>Remove</Btn>
            </div>
          </Card>
        )}
      </div>

      <FormModal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Tenant"
        fields={fields} values={addForm} onChange={(n, v) => setAddForm((f) => ({ ...f, [n]: v }))}
        onSubmit={addTenant} submitLabel="Add Tenant" />

      <FormModal open={showEdit} onClose={() => setShowEdit(false)} title={`Edit — ${selected?.name}`}
        fields={fields} values={editForm} onChange={(n, v) => setEditForm((f) => ({ ...f, [n]: v }))}
        onSubmit={saveEdit} submitLabel="Save Changes" />

      <ConfirmModal open={confirmRemove} onClose={() => setConfirmRemove(false)} onConfirm={removeTenant}
        title="Remove Tenant" danger confirmLabel="Remove Tenant"
        message={`Remove ${selected?.name} from the system? All associated records will be retained for audit purposes.`} />
    </PageLayout>
  );
}
