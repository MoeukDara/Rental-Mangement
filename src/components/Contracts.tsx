import { useState } from "react";
import {
  PageHeader,
  Card,
  Badge,
  Btn,
  TableHead,
  Tr,
  Td,
  PageLayout,
} from "./shared";
import { FormModal, ConfirmModal } from "./Modal";
import { useToast } from "./Toast";

type Contract = {
  id: string;
  tenant: string;
  room: string;
  property: string;
  start: string;
  end: string;
  rent: number;
  deposit: number;
  status: string;
  notice: number;
  terms: string;
};

const initialContracts: Contract[] = [
  {
    id: "CTR-2024-001",
    tenant: "Marcus Tran",
    room: "A-204",
    property: "Greenview Apartments",
    start: "Mar 15, 2024",
    end: "Mar 14, 2027",
    rent: 1850,
    deposit: 3700,
    status: "active",
    notice: 60,
    terms:
      "Monthly rent payable on 1st. Utilities included: water. Tenant responsible for electricity and Wi-Fi.",
  },
  {
    id: "CTR-2025-002",
    tenant: "Sophia Okonkwo",
    room: "B-103",
    property: "Riverside Block B",
    start: "Jan 01, 2025",
    end: "Jan 01, 2026",
    rent: 2100,
    deposit: 4200,
    status: "expiring",
    notice: 30,
    terms: "Quarterly rent in advance. All utilities excluded.",
  },
  {
    id: "CTR-2023-003",
    tenant: "Liam Hartley",
    room: "A-301",
    property: "Greenview Apartments",
    start: "Oct 01, 2023",
    end: "Oct 01, 2026",
    rent: 2400,
    deposit: 4800,
    status: "active",
    notice: 60,
    terms: "Monthly rent payable on 1st. Parking space P-12 included.",
  },
  {
    id: "CTR-2024-004",
    tenant: "Yuki Nakamura",
    room: "C-205",
    property: "Sunset Terrace",
    start: "Jun 15, 2024",
    end: "Jun 15, 2026",
    rent: 2800,
    deposit: 5600,
    status: "active",
    notice: 60,
    terms: "Bi-annual rent review. No subletting.",
  },
  {
    id: "CTR-2024-005",
    tenant: "Daniel Ferreira",
    room: "B-207",
    property: "Riverside Block B",
    start: "May 01, 2024",
    end: "May 01, 2026",
    rent: 2250,
    deposit: 4500,
    status: "breach",
    notice: 30,
    terms: "Monthly rent on 1st. Late fee $150 after 5 days.",
  },
  {
    id: "CTR-2025-006",
    tenant: "Amara Diallo",
    room: "B-101",
    property: "Riverside Block B",
    start: "Feb 01, 2025",
    end: "Feb 01, 2027",
    rent: 1350,
    deposit: 2700,
    status: "active",
    notice: 30,
    terms: "All utilities included in rent.",
  },
  {
    id: "CTR-2023-007",
    tenant: "Elena Vasquez",
    room: "A-401",
    property: "Greenview Apartments",
    start: "Nov 01, 2022",
    end: "Nov 01, 2026",
    rent: 3200,
    deposit: 6400,
    status: "active",
    notice: 90,
    terms: "Premium penthouse. Monthly reviews of shared area charges.",
  },
];

const statusColor: Record<string, "green" | "amber" | "red" | "gray"> = {
  active: "green",
  expiring: "amber",
  breach: "red",
  expired: "gray",
  terminated: "gray",
};

const blank = (keys: string[]) => Object.fromEntries(keys.map((k) => [k, ""]));
const propertyOptions = [
  "Greenview Apartments",
  "Riverside Block B",
  "Sunset Terrace",
];
const roomOptionsByProperty: Record<string, string[]> = {
  "Greenview Apartments": [
    "A-101",
    "A-102",
    "A-103",
    "A-201",
    "A-204",
    "A-301",
    "A-401",
    "A-402",
  ],
  "Riverside Block B": ["B-101", "B-103", "B-201", "B-207", "B-301"],
  "Sunset Terrace": ["C-101", "C-102", "C-205"],
};
const contractFieldNames = [
  "tenant",
  "property",
  "room",
  "start",
  "end",
  "rent",
  "deposit",
  "notice",
  "terms",
];
const getContractFields = (property: string) => [
  { label: "Tenant Name", name: "tenant", required: true },
  {
    label: "Property",
    name: "property",
    type: "select" as const,
    options: propertyOptions,
  },
  {
    label: "Room",
    name: "room",
    type: "select" as const,
    options: property ? (roomOptionsByProperty[property] ?? []) : [],
  },
  { label: "Start Date", name: "start", placeholder: "e.g. Oct 01, 2026" },
  { label: "End Date", name: "end", placeholder: "e.g. Oct 01, 2027" },
  { label: "Monthly Rent ($)", name: "rent", type: "number" as const },
  { label: "Security Deposit ($)", name: "deposit", type: "number" as const },
  { label: "Notice Period (days)", name: "notice", type: "number" as const },
  { label: "Terms & Conditions", name: "terms", type: "textarea" as const },
];

export default function Contracts() {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [selected, setSelected] = useState<Contract | null>(null);
  const [filter, setFilter] = useState("all");

  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState(blank(contractFieldNames));

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const [showRenew, setShowRenew] = useState(false);
  const [renewForm, setRenewForm] = useState<Record<string, string>>({});

  const [confirmTerminate, setConfirmTerminate] = useState(false);

  const filtered = contracts.filter(
    (c) => filter === "all" || c.status === filter,
  );

  const addContract = () => {
    if (!newForm.tenant.trim()) {
      toast("Tenant name is required", "error");
      return;
    }
    if (!newForm.property.trim()) {
      toast("Property is required", "error");
      return;
    }
    if (!newForm.room.trim()) {
      toast("Room is required", "error");
      return;
    }
    const year = new Date().getFullYear();
    const seq = contracts.length + 1;
    const c: Contract = {
      id: `CTR-${year}-${String(seq).padStart(3, "0")}`,
      tenant: newForm.tenant,
      room: newForm.room,
      property: newForm.property,
      start: newForm.start,
      end: newForm.end,
      rent: Number(newForm.rent) || 0,
      deposit: Number(newForm.deposit) || 0,
      status: "active",
      notice: Number(newForm.notice) || 30,
      terms: newForm.terms,
    };
    setContracts([...contracts, c]);
    setShowNew(false);
    setNewForm(blank(contractFieldNames));
    toast(`Contract ${c.id} created`, "success");
  };

  const openEdit = () => {
    if (!selected) return;
    setEditForm({
      tenant: selected.tenant,
      room: selected.room,
      property: selected.property,
      start: selected.start,
      end: selected.end,
      rent: String(selected.rent),
      deposit: String(selected.deposit),
      notice: String(selected.notice),
      terms: selected.terms,
    });
    setShowEdit(true);
  };

  const saveEdit = () => {
    if (!selected) return;
    const updated: Contract = {
      ...selected,
      ...editForm,
      rent: Number(editForm.rent),
      deposit: Number(editForm.deposit),
      notice: Number(editForm.notice),
    };
    setContracts(contracts.map((c) => (c.id === selected.id ? updated : c)));
    setSelected(updated);
    setShowEdit(false);
    toast("Contract updated", "success");
  };

  const openRenew = () => {
    if (!selected) return;
    setRenewForm({
      end: "",
      rent: String(selected.rent),
      terms: selected.terms,
    });
    setShowRenew(true);
  };

  const saveRenew = () => {
    if (!selected) return;
    const updated: Contract = {
      ...selected,
      end: renewForm.end || selected.end,
      rent: Number(renewForm.rent) || selected.rent,
      terms: renewForm.terms || selected.terms,
      status: "active",
    };
    setContracts(contracts.map((c) => (c.id === selected.id ? updated : c)));
    setSelected(updated);
    setShowRenew(false);
    toast(`Contract ${selected.id} renewed to ${updated.end}`, "success");
  };

  const terminateContract = () => {
    if (!selected) return;
    const updated = { ...selected, status: "terminated" };
    setContracts(contracts.map((c) => (c.id === selected.id ? updated : c)));
    setSelected(updated);
    setConfirmTerminate(false);
    toast(`Contract ${selected.id} terminated`, "warning");
  };

  return (
    <PageLayout>
      <PageHeader
        title="Rental Contracts"
        subtitle={`${contracts.length} contracts — ${contracts.filter((c) => c.status === "active").length} active`}
        action={<Btn onClick={() => setShowNew(true)}>+ New Contract</Btn>}
      />

      <div className="flex gap-2 mb-4">
        {["all", "active", "expiring", "breach", "expired", "terminated"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 14px",
                borderRadius: "99px",
                border: "1px solid var(--border)",
                background: filter === f ? "var(--primary)" : "var(--card)",
                color: filter === f ? "white" : "var(--muted-foreground)",
                fontSize: "12px",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                letterSpacing: "0.04em",
                textTransform: "capitalize",
                transition: "all 0.15s",
              }}
            >
              {f}
            </button>
          ),
        )}
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: selected ? "1fr 340px" : "1fr" }}
      >
        <Card>
          <table className="w-full">
            <TableHead
              cols={[
                "Contract ID",
                "Tenant",
                "Room",
                "Property",
                "Period",
                "Monthly Rent",
                "Status",
              ]}
            />
            <tbody>
              {filtered.map((c) => (
                <Tr
                  key={c.id}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}
                >
                  <Td mono>{c.id}</Td>
                  <Td>{c.tenant}</Td>
                  <Td mono>{c.room}</Td>
                  <Td>{c.property}</Td>
                  <Td>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {c.start}
                    </div>
                    <div style={{ fontSize: "12px" }}>→ {c.end}</div>
                  </Td>
                  <Td mono>${c.rent.toLocaleString()}</Td>
                  <Td>
                    <Badge color={statusColor[c.status] ?? "gray"}>
                      {c.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </table>
        </Card>

        {selected && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Contract Detail
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  fontSize: "18px",
                  color: "var(--muted-foreground)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                color: "var(--muted-foreground)",
                letterSpacing: "0.08em",
                marginBottom: "8px",
              }}
            >
              {selected.id}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              {selected.tenant}
            </div>
            <div className="flex flex-col gap-3 mb-4">
              {(
                [
                  ["Room", `${selected.room} · ${selected.property}`],
                  ["Start Date", selected.start],
                  ["End Date", selected.end],
                  ["Monthly Rent", `$${selected.rent.toLocaleString()}`],
                  ["Security Deposit", `$${selected.deposit.toLocaleString()}`],
                  ["Notice Period", `${selected.notice} days`],
                  ["Status", selected.status],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    paddingBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontFamily: "var(--font-mono)",
                      color: "var(--muted-foreground)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: "2px",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight:
                        label === "Monthly Rent" || label === "Security Deposit"
                          ? 600
                          : 400,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: "var(--muted)",
                borderRadius: "var(--radius)",
                padding: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                  color: "var(--muted-foreground)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Terms
              </div>
              <p style={{ fontSize: "12px", lineHeight: 1.6 }}>
                {selected.terms}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {selected.status !== "terminated" && (
                <Btn size="sm" onClick={openRenew}>
                  Renew
                </Btn>
              )}
              {selected.status !== "terminated" && (
                <Btn variant="secondary" size="sm" onClick={openEdit}>
                  Edit
                </Btn>
              )}
              {selected.status !== "terminated" && (
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmTerminate(true)}
                >
                  Terminate
                </Btn>
              )}
              <Btn
                variant="ghost"
                size="sm"
                onClick={() =>
                  toast(
                    `Contract ${selected.id} sent to ${selected.tenant}`,
                    "info",
                  )
                }
              >
                Email Copy
              </Btn>
            </div>
          </Card>
        )}
      </div>

      <FormModal
        open={showNew}
        onClose={() => setShowNew(false)}
        title="New Rental Contract"
        fields={getContractFields(newForm.property)}
        values={newForm}
        onChange={(n, v) =>
          setNewForm((f) => ({
            ...f,
            [n]: v,
            ...(n === "property" ? { room: "" } : {}),
          }))
        }
        onSubmit={addContract}
        submitLabel="Create Contract"
      />

      <FormModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title={`Edit Contract — ${selected?.id}`}
        fields={getContractFields(
          editForm.property || selected?.property || "",
        )}
        values={editForm}
        onChange={(n, v) =>
          setEditForm((f) => ({
            ...f,
            [n]: v,
            ...(n === "property" ? { room: "" } : {}),
          }))
        }
        onSubmit={saveEdit}
        submitLabel="Save Changes"
      />

      <FormModal
        open={showRenew}
        onClose={() => setShowRenew(false)}
        title={`Renew Contract — ${selected?.id}`}
        fields={[
          {
            label: "New End Date",
            name: "end",
            placeholder: "e.g. Mar 14, 2028",
            required: true,
          },
          {
            label: "New Monthly Rent ($)",
            name: "rent",
            type: "number" as const,
          },
          { label: "Updated Terms", name: "terms", type: "textarea" as const },
        ]}
        values={renewForm}
        onChange={(n, v) => setRenewForm((f) => ({ ...f, [n]: v }))}
        onSubmit={saveRenew}
        submitLabel="Renew Contract"
      />

      <ConfirmModal
        open={confirmTerminate}
        onClose={() => setConfirmTerminate(false)}
        onConfirm={terminateContract}
        title="Terminate Contract"
        danger
        confirmLabel="Terminate Contract"
        message={`Terminate contract ${selected?.id} for ${selected?.tenant}? This will mark the contract as terminated. The notice period is ${selected?.notice} days.`}
      />
    </PageLayout>
  );
}
