import { useState } from "react";

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

type UserAccountProps = {
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  currentUser: Account | null;
};

const permissionOptions = [
  { id: "dashboard", label: "Dashboard" },
  { id: "properties", label: "Properties & Rooms" },
  { id: "tenants", label: "Tenants" },
  { id: "contracts", label: "Contracts" },
  { id: "billing", label: "Monthly Billing" },
  { id: "deposits", label: "Deposits" },
  { id: "charges", label: "Recurring Charges" },
  { id: "payments", label: "Payments" },
  { id: "reports", label: "Reports" },
  { id: "user-account", label: "User Account" },
];

const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrator",
  manager: "Manager",
  accountant: "Accountant",
  staff: "Staff",
};

const rolePermissions: Record<Role, string[]> = {
  admin: permissionOptions.map((item) => item.id),
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

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "staff" as Role,
  enabled: true,
  customPermissions: [] as string[],
};

function UserAccount({ accounts, setAccounts, currentUser }: UserAccountProps) {
  const [newUser, setNewUser] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleExtraPermission = (accountId: string, permissionId: string) => {
    setAccounts((prev) =>
      prev.map((account) => {
        if (account.id !== accountId) return account;

        const alreadyAdded = account.customPermissions.includes(permissionId);
        return {
          ...account,
          customPermissions: alreadyAdded
            ? account.customPermissions.filter((item) => item !== permissionId)
            : [...account.customPermissions, permissionId],
        };
      }),
    );
  };

  const toggleEnabled = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? { ...account, enabled: !account.enabled }
          : account,
      ),
    );
  };

  const updateRole = (accountId: string, role: Role) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId ? { ...account, role } : account,
      ),
    );
  };

  const handleAddUser = () => {
    const name = newUser.name.trim();
    const email = newUser.email.trim();

    if (!name || !email || !newUser.password.trim()) {
      setError("Please fill in name, email, and password.");
      setSuccess("");
      return;
    }

    const exists = accounts.some(
      (account) => account.email.toLowerCase() === email.toLowerCase(),
    );

    if (exists) {
      setError("A user with this email already exists.");
      setSuccess("");
      return;
    }

    const createdAccount: Account = {
      id: `acc-${Date.now()}`,
      name,
      email,
      password: newUser.password,
      role: newUser.role,
      enabled: newUser.enabled,
      customPermissions: newUser.customPermissions,
    };

    setAccounts((prev) => [createdAccount, ...prev]);
    setNewUser(emptyForm);
    setError("");
    setSuccess(`User ${name} was added successfully.`);
  };

  const resetForm = () => {
    setNewUser(emptyForm);
    setError("");
    setSuccess("");
  };

  return (
    <div style={{ padding: "28px 32px", minHeight: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "22px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--muted-foreground)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
            }}
          >
            Access management
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 700,
              margin: "6px 0 0",
              letterSpacing: "-0.03em",
            }}
          >
            User Account
          </h1>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "minmax(320px, 420px) minmax(0, 1fr)",
        }}
      >
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            Add New User
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            <label style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
              <span style={{ color: "var(--muted-foreground)" }}>
                Full name
              </span>
              <input
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, name: e.target.value }))
                }
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  background: "var(--background)",
                  color: "var(--foreground)",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
              <span style={{ color: "var(--muted-foreground)" }}>Email</span>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, email: e.target.value }))
                }
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  background: "var(--background)",
                  color: "var(--foreground)",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
              <span style={{ color: "var(--muted-foreground)" }}>Password</span>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, password: e.target.value }))
                }
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  background: "var(--background)",
                  color: "var(--foreground)",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
              <span style={{ color: "var(--muted-foreground)" }}>Role</span>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    role: e.target.value as Role,
                  }))
                }
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  background: "var(--background)",
                  color: "var(--foreground)",
                }}
              >
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.05em",
                  color: "var(--muted-foreground)",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                }}
              >
                Extra permissions
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {permissionOptions.map((permission) => {
                  const checked = newUser.customPermissions.includes(
                    permission.id,
                  );
                  return (
                    <label
                      key={permission.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 8px",
                        borderRadius: "999px",
                        border: "1px solid var(--border)",
                        background: checked
                          ? "rgba(167, 212, 184, 0.18)"
                          : "var(--muted)",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setNewUser((prev) => ({
                            ...prev,
                            customPermissions: checked
                              ? prev.customPermissions.filter(
                                  (item) => item !== permission.id,
                                )
                              : [...prev.customPermissions, permission.id],
                          }))
                        }
                      />
                      {permission.label}
                    </label>
                  );
                })}
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: "#FEE2E2",
                  color: "#991B1B",
                  borderRadius: "8px",
                  padding: "8px 10px",
                  fontSize: "12px",
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  background: "#D1FAE5",
                  color: "#065F46",
                  borderRadius: "8px",
                  padding: "8px 10px",
                  fontSize: "12px",
                }}
              >
                {success}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleAddUser}
                style={{
                  border: "none",
                  background: "var(--primary)",
                  color: "white",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Save User
              </button>
              <button
                onClick={resetForm}
                style={{
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--foreground)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            Manage Existing Users
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {accounts.map((account) => {
              const isCurrentUser = currentUser?.id === account.id;
              const baseRolePermissions = rolePermissions[account.role];
              const allPermissions = [
                ...new Set([
                  ...baseRolePermissions,
                  ...account.customPermissions,
                ]),
              ];

              return (
                <div
                  key={account.id}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "14px",
                    background: "var(--muted)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "14px" }}>
                        {account.name}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--muted-foreground)",
                          marginTop: "2px",
                        }}
                      >
                        {account.email}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleEnabled(account.id)}
                      disabled={isCurrentUser}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "999px",
                        background: account.enabled ? "#D1FAE5" : "#F3F4F6",
                        color: account.enabled ? "#065F46" : "#374151",
                        padding: "5px 10px",
                        cursor: isCurrentUser ? "not-allowed" : "pointer",
                        fontSize: "11px",
                        fontWeight: 600,
                        opacity: isCurrentUser ? 0.7 : 1,
                      }}
                    >
                      {account.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "12px",
                      marginTop: "14px",
                    }}
                  >
                    <label
                      style={{ display: "grid", gap: "6px", fontSize: "13px" }}
                    >
                      <span style={{ color: "var(--muted-foreground)" }}>
                        Role
                      </span>
                      <select
                        value={account.role}
                        onChange={(e) =>
                          updateRole(account.id, e.target.value as Role)
                        }
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          padding: "8px 10px",
                          background: "var(--background)",
                          color: "var(--foreground)",
                        }}
                      >
                        {Object.entries(ROLE_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.05em",
                          color: "var(--muted-foreground)",
                          textTransform: "uppercase",
                          marginBottom: "8px",
                        }}
                      >
                        Permissions
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        {allPermissions.map((permission) => (
                          <span
                            key={`${account.id}-${permission}`}
                            style={{
                              background: "rgba(167, 212, 184, 0.12)",
                              color: "var(--foreground)",
                              borderRadius: "999px",
                              padding: "5px 8px",
                              fontSize: "10px",
                            }}
                          >
                            {permissionOptions.find(
                              (item) => item.id === permission,
                            )?.label ?? permission}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.05em",
                          color: "var(--muted-foreground)",
                          textTransform: "uppercase",
                          marginBottom: "8px",
                        }}
                      >
                        Extra permissions
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {permissionOptions.map((permission) => {
                          const extra = account.customPermissions.includes(
                            permission.id,
                          );
                          return (
                            <label
                              key={`${account.id}-${permission.id}`}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 8px",
                                borderRadius: "999px",
                                border: "1px solid var(--border)",
                                background: extra
                                  ? "rgba(167, 212, 184, 0.18)"
                                  : "var(--background)",
                                fontSize: "11px",
                                cursor: "pointer",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={extra}
                                onChange={() =>
                                  toggleExtraPermission(
                                    account.id,
                                    permission.id,
                                  )
                                }
                              />
                              {permission.label}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAccount;
