import { useState } from "react";
import {
  PageHeader,
  Card,
  Badge,
  Btn,
  TableHead,
  Tr,
  Td,
  StatCard,
  PageLayout,
} from "./shared";
import { ConfirmModal, Modal } from "./Modal";
import { useToast } from "./Toast";

const propertyMap: Record<string, string> = {
  "A-204": "Greenview Apartments",
  "A-301": "Greenview Apartments",
  "A-401": "Greenview Apartments",
  "B-101": "Riverside Block B",
  "B-103": "Riverside Block B",
  "B-207": "Riverside Block B",
  "C-102": "Sunset Terrace",
  "C-205": "Sunset Terrace",
};

const recurringUnitsByRoom: Record<
  string,
  { water: number; electricity: number; wifi: number; parking: number }
> = {
  "A-204": { water: 53, electricity: 857, wifi: 1, parking: 0 },
  "A-301": { water: 80, electricity: 1393, wifi: 1, parking: 1 },
  "A-401": { water: 0, electricity: 0, wifi: 1, parking: 2 },
  "B-101": { water: 0, electricity: 0, wifi: 0, parking: 0 },
  "B-103": { water: 61, electricity: 0, wifi: 1, parking: 1 },
  "B-207": { water: 58, electricity: 1250, wifi: 1, parking: 1 },
  "C-102": { water: 0, electricity: 0, wifi: 1, parking: 1 },
  "C-205": { water: 85, electricity: 1500, wifi: 1, parking: 0 },
};

function InvoicePreview({
  bill,
  onClose,
  onMarkPaid,
  onPrint,
  onEmail,
}: {
  bill: Bill;
  onClose: () => void;
  onMarkPaid: () => void;
  onPrint: () => void;
  onEmail: () => void;
}) {
  const property = propertyMap[bill.room] ?? "RentFlow Properties";
  const recurringUnits = recurringUnitsByRoom[bill.room] ?? {
    water: 0,
    electricity: 0,
    wifi: 0,
    parking: 0,
  };

  const lineItems = [
    {
      desc: "Base Rent",
      unitsUsed: "1 month",
      unitPrice: `$${bill.rent.toLocaleString()}.00`,
      amount: bill.rent,
    },
    ...(bill.water > 0
      ? [
          {
            desc: "Water Supply",
            unitsUsed: `${recurringUnits.water} m³`,
            unitPrice: "$0.85 / m³",
            amount: bill.water,
          },
        ]
      : []),
    ...(bill.electricity > 0
      ? [
          {
            desc: "Electricity",
            unitsUsed: `${recurringUnits.electricity} kWh`,
            unitPrice: "$0.14 / kWh",
            amount: bill.electricity,
          },
        ]
      : []),
    ...(bill.wifi > 0
      ? [
          {
            desc: "Wi-Fi Service",
            unitsUsed: `${recurringUnits.wifi} unit`,
            unitPrice: "$40.00 flat",
            amount: bill.wifi,
          },
        ]
      : []),
    ...(bill.parking > 0
      ? [
          {
            desc: "Parking Bay",
            unitsUsed: `${recurringUnits.parking} bay`,
            unitPrice: "$80.00 flat",
            amount: bill.parking,
          },
        ]
      : []),
  ];

  const statusStyles: Record<
    string,
    { bg: string; color: string; label: string }
  > = {
    paid: { bg: "#D1FAE5", color: "#065F46", label: "PAID" },
    pending: { bg: "#FEF3C7", color: "#92400E", label: "PENDING" },
    overdue: { bg: "#FEE2E2", color: "#991B1B", label: "OVERDUE" },
  };
  const st = statusStyles[bill.status] ?? statusStyles.pending;

  return (
    <Modal
      open
      onClose={onClose}
      title="Invoice Preview"
      width="600px"
      footer={
        <div className="flex gap-2 w-full">
          <div className="flex gap-2">
            {bill.status !== "paid" && (
              <Btn onClick={onMarkPaid}>Mark as Paid</Btn>
            )}
            <Btn variant="secondary" onClick={onPrint}>
              Print
            </Btn>
            <Btn variant="ghost" onClick={onEmail}>
              Send Email
            </Btn>
          </div>
          <Btn variant="ghost" onClick={onClose}>
            Close
          </Btn>
        </div>
      }
    >
      {/* Invoice document */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        {/* Header band */}
        <div
          style={{
            background: "var(--sidebar)",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              RentFlow
            </div>
            <div
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                color: "#6B8B75",
                letterSpacing: "0.08em",
                marginTop: "2px",
              }}
            >
              MANAGEMENT
            </div>
            <div
              style={{
                marginTop: "14px",
                fontSize: "12px",
                color: "#A7D4B8",
                lineHeight: 1.6,
              }}
            >
              {property}
              <br />
              Metro City, MC 10001
              <br />
              admin@rentflow.co
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#6B8B75",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Invoice
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "18px",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.01em",
              }}
            >
              {bill.id}
            </div>
            <div
              style={{
                marginTop: "14px",
                fontSize: "12px",
                color: "#A7D4B8",
                lineHeight: 1.8,
              }}
            >
              <div>Issued: Sep 01, 2026</div>
              <div>Due: {bill.due}</div>
            </div>
            <div
              style={{
                marginTop: "10px",
                display: "inline-block",
                background: st.bg,
                color: st.color,
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                padding: "3px 10px",
                borderRadius: "4px",
              }}
            >
              {st.label}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ padding: "20px 28px 0" }}>
          <div>
            <div
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-mono)",
                color: "var(--muted-foreground)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Bill To
            </div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "var(--foreground)",
              }}
            >
              {bill.tenant}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
                marginTop: "2px",
                fontFamily: "var(--font-mono)",
              }}
            >
              Room {bill.room} · {property}
            </div>
          </div>
        </div>

        {/* Line items */}
        <div style={{ padding: "20px 28px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                {[
                  { label: "Description", align: "left" as const },
                  { label: "Units Used", align: "left" as const },
                  { label: "Unit Price", align: "left" as const },
                  { label: "Amount", align: "right" as const },
                ].map((h) => (
                  <th
                    key={h.label}
                    style={{
                      textAlign: h.align,
                      padding: "8px 0",
                      fontSize: "10px",
                      fontFamily: "var(--font-mono)",
                      color: "var(--muted-foreground)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td
                    style={{
                      padding: "11px 0",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    {item.desc}
                  </td>
                  <td
                    style={{
                      padding: "11px 0",
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {item.unitsUsed}
                  </td>
                  <td
                    style={{
                      padding: "11px 0",
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {item.unitPrice}
                  </td>
                  <td
                    style={{
                      padding: "11px 0",
                      fontSize: "13px",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 500,
                      textAlign: "right",
                    }}
                  >
                    ${item.amount.toLocaleString()}.00
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "6px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "60px",
                fontSize: "12px",
                color: "var(--muted-foreground)",
              }}
            >
              <span>Subtotal</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>
                ${bill.total.toLocaleString()}.00
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "60px",
                fontSize: "12px",
                color: "var(--muted-foreground)",
              }}
            >
              <span>Tax (0%)</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>$0.00</span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "60px",
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                borderTop: "2px solid var(--foreground)",
                paddingTop: "8px",
                marginTop: "4px",
              }}
            >
              <span style={{ fontFamily: "var(--font-display)" }}>
                Total Due
              </span>
              <span style={{ fontFamily: "var(--font-mono)" }}>
                ${bill.total.toLocaleString()}.00
              </span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div
          style={{
            background: "var(--muted)",
            padding: "14px 28px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "var(--muted-foreground)",
              lineHeight: 1.6,
            }}
          >
            Payment is due by <strong>{bill.due}</strong>. Please include
            invoice number <strong>{bill.id}</strong> in your bank transfer
            reference. Late payments may incur a $150 fee after 5 business days.
            Contact us at admin@rentflow.co for queries.
          </p>
        </div>
      </div>
    </Modal>
  );
}

type Bill = {
  id: string;
  tenant: string;
  room: string;
  rent: number;
  water: number;
  electricity: number;
  wifi: number;
  parking: number;
  total: number;
  due: string;
  status: string;
};

const months = ["Sep 2026", "Aug 2026", "Jul 2026", "Jun 2026"];

const initialBills: Bill[] = [
  {
    id: "INV-2609-001",
    tenant: "Marcus Tran",
    room: "A-204",
    rent: 1850,
    water: 45,
    electricity: 120,
    wifi: 40,
    parking: 0,
    total: 2055,
    due: "Sep 05, 2026",
    status: "paid",
  },
  {
    id: "INV-2609-002",
    tenant: "Sophia Okonkwo",
    room: "B-103",
    rent: 2100,
    water: 52,
    electricity: 0,
    wifi: 40,
    parking: 80,
    total: 2272,
    due: "Sep 05, 2026",
    status: "paid",
  },
  {
    id: "INV-2609-003",
    tenant: "Liam Hartley",
    room: "A-301",
    rent: 2400,
    water: 68,
    electricity: 195,
    wifi: 40,
    parking: 80,
    total: 2783,
    due: "Sep 05, 2026",
    status: "pending",
  },
  {
    id: "INV-2609-004",
    tenant: "Yuki Nakamura",
    room: "C-205",
    rent: 2800,
    water: 72,
    electricity: 210,
    wifi: 40,
    parking: 0,
    total: 3122,
    due: "Sep 05, 2026",
    status: "paid",
  },
  {
    id: "INV-2609-005",
    tenant: "Daniel Ferreira",
    room: "B-207",
    rent: 2250,
    water: 58,
    electricity: 175,
    wifi: 40,
    parking: 80,
    total: 2603,
    due: "Sep 05, 2026",
    status: "overdue",
  },
  {
    id: "INV-2609-006",
    tenant: "Amara Diallo",
    room: "B-101",
    rent: 1350,
    water: 0,
    electricity: 0,
    wifi: 0,
    parking: 0,
    total: 1350,
    due: "Sep 05, 2026",
    status: "paid",
  },
  {
    id: "INV-2609-007",
    tenant: "Priya Mehta",
    room: "C-102",
    rent: 2050,
    water: 60,
    electricity: 155,
    wifi: 40,
    parking: 80,
    total: 2385,
    due: "Sep 05, 2026",
    status: "paid",
  },
  {
    id: "INV-2609-008",
    tenant: "Elena Vasquez",
    room: "A-401",
    rent: 3200,
    water: 88,
    electricity: 320,
    wifi: 40,
    parking: 160,
    total: 3808,
    due: "Sep 05, 2026",
    status: "paid",
  },
];

const statusColor: Record<string, "green" | "amber" | "red" | "gray"> = {
  paid: "green",
  pending: "amber",
  overdue: "red",
  draft: "gray",
};

export default function Billing() {
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [month, setMonth] = useState(months[0]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmGenerate, setConfirmGenerate] = useState(false);
  const [reminderTarget, setReminderTarget] = useState<Bill | null>(null);
  const [previewBill, setPreviewBill] = useState<Bill | null>(null);

  const markPaid = (id: string) => {
    setBills(bills.map((b) => (b.id === id ? { ...b, status: "paid" } : b)));
    toast("Invoice marked as paid", "success");
  };

  const generateBills = () => {
    setConfirmGenerate(false);
    toast("Bills generated for all active tenants — Oct 2026", "success");
  };

  const exportCSV = () => {
    const rows = [
      [
        "Invoice",
        "Tenant",
        "Room",
        "Rent",
        "Water",
        "Electricity",
        "WiFi",
        "Parking",
        "Total",
        "Status",
      ],
      ...bills.map((b) => [
        b.id,
        b.tenant,
        b.room,
        b.rent,
        b.water,
        b.electricity,
        b.wifi,
        b.parking,
        b.total,
        b.status,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billing-${month.replace(" ", "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast("CSV exported", "success");
  };

  const totalRevenue = bills
    .filter((b) => b.status === "paid")
    .reduce((a, b) => a + b.total, 0);
  const totalOutstanding = bills
    .filter((b) => b.status !== "paid")
    .reduce((a, b) => a + b.total, 0);

  return (
    <PageLayout>
      <PageHeader
        title="Monthly Billing"
        subtitle="Generate and track monthly invoices"
        action={
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={exportCSV}>
              Export CSV
            </Btn>
            <Btn onClick={() => setConfirmGenerate(true)}>Generate Bills</Btn>
          </div>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Total Billed"
          value={`$${bills.reduce((a, b) => a + b.total, 0).toLocaleString()}`}
          sub="Sep 2026"
          accent
        />
        <StatCard
          label="Collected"
          value={`$${totalRevenue.toLocaleString()}`}
          sub={`${bills.filter((b) => b.status === "paid").length} invoices`}
        />
        <StatCard
          label="Outstanding"
          value={`$${totalOutstanding.toLocaleString()}`}
          sub={`${bills.filter((b) => b.status !== "paid").length} unpaid`}
        />
        <StatCard
          label="Avg Invoice"
          value={`$${Math.round(bills.reduce((a, b) => a + b.total, 0) / bills.length).toLocaleString()}`}
          sub="per tenant"
        />
      </div>

      <div className="flex gap-2 mb-4">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setMonth(m)}
            style={{
              padding: "5px 14px",
              borderRadius: "99px",
              border: "1px solid var(--border)",
              background: month === m ? "var(--primary)" : "var(--card)",
              color: month === m ? "white" : "var(--muted-foreground)",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <Card>
        <table className="w-full">
          <TableHead
            cols={[
              "Invoice",
              "Tenant",
              "Room",
              "Rent",
              "Water",
              "Electricity",
              "Wi-Fi",
              "Parking",
              "Total",
              "Due Date",
              "Status",
              "",
            ]}
          />
          <tbody>
            {bills.map((b) => (
              <>
                <Tr
                  key={b.id}
                  onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                >
                  <Td mono>{b.id}</Td>
                  <Td>{b.tenant}</Td>
                  <Td mono>{b.room}</Td>
                  <Td mono>${b.rent.toLocaleString()}</Td>
                  <Td mono>{b.water > 0 ? `$${b.water}` : "—"}</Td>
                  <Td mono>
                    {b.electricity > 0 ? `$${b.electricity}` : "incl."}
                  </Td>
                  <Td mono>{b.wifi > 0 ? `$${b.wifi}` : "incl."}</Td>
                  <Td mono>{b.parking > 0 ? `$${b.parking}` : "—"}</Td>
                  <Td mono>
                    <strong>${b.total.toLocaleString()}</strong>
                  </Td>
                  <Td>{b.due}</Td>
                  <Td>
                    <Badge color={statusColor[b.status]}>{b.status}</Badge>
                  </Td>
                  <Td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewBill(b);
                      }}
                      title="Preview Invoice"
                      style={{
                        background: "none",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        color: "var(--muted-foreground)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "11px",
                        fontFamily: "var(--font-mono)",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "var(--muted)";
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--foreground)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "none";
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--muted-foreground)";
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Preview
                    </button>
                  </Td>
                </Tr>
                {expanded === b.id && (
                  <tr key={`${b.id}-exp`}>
                    <td
                      colSpan={12}
                      style={{
                        background: "var(--muted)",
                        padding: "14px 20px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <div className="flex gap-6 items-center flex-wrap">
                        <div>
                          <div
                            style={{
                              fontSize: "11px",
                              fontFamily: "var(--font-mono)",
                              color: "var(--muted-foreground)",
                              marginBottom: "6px",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            Charge Breakdown
                          </div>
                          <div className="flex gap-4">
                            {(
                              [
                                ["Base Rent", b.rent],
                                ["Water", b.water],
                                ["Electricity", b.electricity],
                                ["Wi-Fi", b.wifi],
                                ["Parking", b.parking],
                              ] as [string, number][]
                            ).map(([label, amount]) => (
                              <div key={label} style={{ textAlign: "center" }}>
                                <div
                                  style={{
                                    fontSize: "14px",
                                    fontFamily: "var(--font-mono)",
                                    fontWeight: 600,
                                  }}
                                >
                                  ${amount.toLocaleString()}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "var(--muted-foreground)",
                                  }}
                                >
                                  {label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-auto flex-wrap">
                          <Btn size="sm" onClick={() => setPreviewBill(b)}>
                            Preview Invoice
                          </Btn>
                          {b.status !== "paid" && (
                            <Btn
                              variant="secondary"
                              size="sm"
                              onClick={() => markPaid(b.id)}
                            >
                              Mark Paid
                            </Btn>
                          )}
                          {b.status !== "paid" && (
                            <Btn
                              variant="secondary"
                              size="sm"
                              onClick={() => setReminderTarget(b)}
                            >
                              Send Reminder
                            </Btn>
                          )}
                          <Btn
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toast(`Invoice ${b.id} sent to printer`, "info")
                            }
                          >
                            Print
                          </Btn>
                          <Btn
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toast(
                                `Invoice ${b.id} emailed to ${b.tenant}`,
                                "info",
                              )
                            }
                          >
                            Email
                          </Btn>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </Card>

      <ConfirmModal
        open={confirmGenerate}
        onClose={() => setConfirmGenerate(false)}
        onConfirm={generateBills}
        title="Generate Monthly Bills"
        message="This will generate invoices for all active tenants for October 2026, applying their current rent and utility charges. Continue?"
      />

      <ConfirmModal
        open={!!reminderTarget}
        onClose={() => setReminderTarget(null)}
        onConfirm={() => {
          toast(
            `Payment reminder sent to ${reminderTarget?.tenant}`,
            "success",
          );
          setReminderTarget(null);
        }}
        title="Send Payment Reminder"
        message={`Send a payment reminder to ${reminderTarget?.tenant} for invoice ${reminderTarget?.id} ($${reminderTarget?.total.toLocaleString()} due ${reminderTarget?.due})?`}
        confirmLabel="Send Reminder"
      />

      {previewBill && (
        <InvoicePreview
          bill={previewBill}
          onClose={() => setPreviewBill(null)}
          onMarkPaid={() => {
            markPaid(previewBill.id);
            setPreviewBill((b) => (b ? { ...b, status: "paid" } : null));
          }}
          onPrint={() =>
            toast(`Invoice ${previewBill.id} sent to printer`, "info")
          }
          onEmail={() =>
            toast(
              `Invoice ${previewBill.id} emailed to ${previewBill.tenant}`,
              "info",
            )
          }
        />
      )}
    </PageLayout>
  );
}
