import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Properties from "./components/Properties";
import Tenants from "./components/Tenants";
import Contracts from "./components/Contracts";
import Billing from "./components/Billing";
import Deposits from "./components/Deposits";
import RecurringCharges from "./components/RecurringCharges";
import Payments from "./components/Payments";
import Reports from "./components/Reports";
import UserAccount from "./components/UserAccount";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "properties", label: "Properties & Rooms", icon: BuildingIcon },
  { id: "tenants", label: "Tenants", icon: TenantsIcon },
  { id: "contracts", label: "Contracts", icon: ContractIcon },
  { id: "billing", label: "Monthly Billing", icon: BillingIcon },
  { id: "deposits", label: "Deposits", icon: DepositIcon },
  { id: "charges", label: "Recurring Charges", icon: ChargesIcon },
  { id: "payments", label: "Payments", icon: PaymentIcon },
  { id: "reports", label: "Reports", icon: ReportsIcon },
  { id: "user-account", label: "User Account", icon: UserAccountIcon },
];

type Role = "admin" | "manager" | "accountant" | "staff";

type Account = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  enabled: boolean;
  customPermissions: string[];
};

const CURRENT_USER_KEY = "rentflow-current-user";
const ACCOUNTS_STORAGE_KEY = "rentflow-accounts";

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: "acc-admin",
    name: "Admin Manager",
    email: "admin@rentflow.co",
    password: "admin123",
    role: "admin",
    enabled: true,
    customPermissions: [],
  },
  {
    id: "acc-manager",
    name: "Operations Manager",
    email: "manager@rentflow.co",
    password: "manager123",
    role: "manager",
    enabled: true,
    customPermissions: [],
  },
  {
    id: "acc-accountant",
    name: "Finance Accountant",
    email: "accountant@rentflow.co",
    password: "accountant123",
    role: "accountant",
    enabled: true,
    customPermissions: [],
  },
  {
    id: "acc-staff",
    name: "Property Staff",
    email: "staff@rentflow.co",
    password: "staff123",
    role: "staff",
    enabled: true,
    customPermissions: [],
  },
];

const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrator",
  manager: "Manager",
  accountant: "Accountant",
  staff: "Staff",
};

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: NAV.map((item) => item.id),
  manager: [
    "dashboard",
    "properties",
    "tenants",
    "contracts",
    "billing",
    "deposits",
    "charges",
    "payments",
    "reports",
  ],
  accountant: ["dashboard", "billing", "deposits", "payments", "reports"],
  staff: ["dashboard", "properties", "tenants", "contracts"],
};

function canAccess(user: Account | null, moduleId: string) {
  if (!user || !user.enabled) return false;

  const permissions = [
    ...new Set([...ROLE_PERMISSIONS[user.role], ...user.customPermissions]),
  ];

  return permissions.includes(moduleId);
}

function loadAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return DEFAULT_ACCOUNTS;

    const parsed = JSON.parse(raw) as Account[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_ACCOUNTS;

    return parsed.map((account) => ({
      ...account,
      enabled: account.enabled ?? true,
      customPermissions: account.customPermissions ?? [],
    }));
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

function getStoredAccount(): Account | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Account;
    return parsed
      ? {
          ...parsed,
          enabled: parsed.enabled ?? true,
          customPermissions: parsed.customPermissions ?? [],
        }
      : null;
  } catch {
    return null;
  }
}

function DashboardIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="18" rx="1" />
      <path d="M9 21V9h6v12M9 9H2M15 9h7" />
    </svg>
  );
}

function TenantsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ContractIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}

function BillingIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function DepositIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4l3 3" />
    </svg>
  );
}

function ChargesIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function UserAccountIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const COMPONENTS: Record<string, React.ComponentType<any>> = {
  dashboard: Dashboard,
  properties: Properties,
  tenants: Tenants,
  contracts: Contracts,
  billing: Billing,
  deposits: Deposits,
  charges: RecurringCharges,
  payments: Payments,
  reports: Reports,
  "user-account": UserAccount,
};

function LoginScreen({
  form,
  setForm,
  onLogin,
  error,
  accounts,
}: {
  form: { email: string; password: string };
  setForm: React.Dispatch<
    React.SetStateAction<{ email: string; password: string }>
  >;
  onLogin: React.FormEventHandler<HTMLFormElement>;
  error: string;
  accounts: Account[];
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "28px",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--primary)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--foreground)",
              }}
            >
              RentFlow
            </div>
          </div>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            margin: "0 0 8px",
            color: "var(--foreground)",
          }}
        >
          Sign in
        </h2>
        <p
          style={{
            margin: "0 0 22px",
            color: "var(--muted-foreground)",
            fontSize: "13px",
          }}
        >
          Access the property management dashboard with role-based permissions.
        </p>

        <form onSubmit={onLogin} style={{ display: "grid", gap: "16px" }}>
          <label style={{ display: "grid", gap: "8px", fontSize: "13px" }}>
            <span style={{ color: "var(--muted-foreground)" }}>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="name@rentflow.co"
              style={{
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
                borderRadius: "10px",
                padding: "10px 12px",
                fontSize: "14px",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: "8px", fontSize: "13px" }}>
            <span style={{ color: "var(--muted-foreground)" }}>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Enter password"
              style={{
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
                borderRadius: "10px",
                padding: "10px 12px",
                fontSize: "14px",
              }}
            />
          </label>

          {error && (
            <div
              style={{
                background: "#FEE2E2",
                color: "#991B1B",
                borderRadius: "10px",
                padding: "10px 12px",
                fontSize: "12px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              border: "none",
              cursor: "pointer",
              borderRadius: "10px",
              padding: "11px 16px",
              background: "var(--primary)",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Sign In
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            paddingTop: "18px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "var(--muted-foreground)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Demo accounts
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            {accounts.map((account) => (
              <div
                key={account.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  background: "var(--muted)",
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>
                    {account.name}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {account.email}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                  }}
                >
                  {ROLE_LABELS[account.role]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [accounts, setAccounts] = useState<Account[]>(() => loadAccounts());
  const [currentUser, setCurrentUser] = useState<Account | null>(() =>
    getStoredAccount(),
  );
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const visibleNav = NAV.filter((item) => canAccess(currentUser, item.id));

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && !canAccess(currentUser, active)) {
      setActive("dashboard");
    }
  }, [currentUser, active]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const account = accounts.find(
      (item) =>
        item.email.toLowerCase() === loginForm.email.trim().toLowerCase() &&
        item.password === loginForm.password,
    );

    if (!account) {
      setLoginError(
        "Invalid email or password. Please use one of the demo accounts.",
      );
      return;
    }

    if (!account.enabled) {
      setLoginError("This user account is currently disabled.");
      return;
    }

    setCurrentUser(account);
    setLoginError("");
    setLoginForm({ email: "", password: "" });
    setActive("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginError("");
    setLoginForm({ email: "", password: "" });
    setActive("dashboard");
  };

  const ActiveComponent = COMPONENTS[active];

  if (!currentUser) {
    return (
      <LoginScreen
        form={loginForm}
        setForm={setLoginForm}
        onLogin={handleLogin}
        error={loginError}
        accounts={accounts}
      />
    );
  }

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <aside
        className="flex flex-col w-56 shrink-0 h-full overflow-y-auto"
        style={{
          background: "var(--sidebar)",
          borderRight: "1px solid #1a2e22",
        }}
      >
        <div
          className="px-5 pt-6 pb-5"
          style={{ borderBottom: "1px solid #1a2e22" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded flex items-center justify-center shrink-0"
              style={{ background: "var(--primary)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#EEF2EE",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                RentFlow
              </div>
              <div
                style={{
                  color: "#6B8B75",
                  fontSize: "10px",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.05em",
                }}
              >
                MANAGEMENT
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {visibleNav.map((item) => {
            const isActive = active === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded transition-all duration-150 cursor-pointer"
                style={{
                  background: isActive
                    ? "var(--sidebar-active)"
                    : "transparent",
                  color: isActive ? "#ffffff" : "var(--sidebar-foreground)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--sidebar-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                }}
              >
                <span style={{ opacity: isActive ? 1 : 0.7 }}>
                  <Icon />
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.01em",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div
          className="px-4 pb-5 pt-3"
          style={{ borderTop: "1px solid #1a2e22" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
              style={{
                background: "var(--primary)",
                color: "white",
                fontFamily: "var(--font-mono)",
              }}
            >
              {currentUser.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <div
                style={{ color: "#C8D5CA", fontSize: "12px", fontWeight: 500 }}
              >
                {currentUser.name}
              </div>
              <div
                style={{
                  color: "#5A7562",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {currentUser.email}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "12px",
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--sidebar-foreground)",
                borderRadius: "6px",
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: "11px",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main
        className="flex-1 overflow-y-auto"
        style={{ background: "var(--background)" }}
      >
        <ActiveComponent
          accounts={accounts}
          setAccounts={setAccounts}
          currentUser={currentUser}
        />
      </main>
    </div>
  );
}
