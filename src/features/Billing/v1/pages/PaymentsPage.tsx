import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Wallet, BarChart3, CreditCard, Sparkles } from "lucide-react";
import CommunityWalletPage from "./CommunityWalletPage";
import UsageDashboardPage from "./UsageDashboardPage";
import AddFundsPage from "./AddFundsPage";

export default function PaymentsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const TABS = [
    { key: "wallet", label: "Wallet", icon: Wallet, path: "/org/payments/wallet" },
    { key: "usage", label: "Usage", icon: BarChart3, path: "/org/payments/usage" },
    { key: "add-funds", label: "Add Funds", icon: CreditCard, path: "/org/payments/add-funds" },
  ];

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: "var(--cd-bg)" }}>
      <div
        className="shrink-0 border-b"
        style={{
          backgroundColor: "color-mix(in srgb, var(--cd-surface) 94%, transparent)",
          borderColor: "var(--cd-border-subtle)",
          boxShadow: "0 10px 28px var(--cd-shadow)",
        }}
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div
                className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: "var(--cd-primary-subtle)", color: "var(--cd-primary-text)" }}
              >
                <Sparkles size={13} />
                Payments workspace
              </div>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--cd-text)" }}>
                Payments
              </h1>
            </div>

            <div
              className="flex items-center gap-1 overflow-x-auto rounded-xl border p-1"
              style={{ backgroundColor: "var(--cd-bg)", borderColor: "var(--cd-border-subtle)" }}
            >
              {TABS.map((tab) => {
                const isActive = location.pathname.includes(tab.path);
                return (
                  <button
                    key={tab.key}
                    onClick={() => navigate(tab.path)}
                    className="flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all whitespace-nowrap"
                    style={{
                      backgroundColor: isActive ? "var(--cd-surface)" : "transparent",
                      boxShadow: isActive ? "0 8px 18px var(--cd-shadow)" : "none",
                      color: isActive ? "var(--cd-text)" : "var(--cd-text-muted)",
                    }}
                  >
                    <tab.icon size={16} style={{ color: isActive ? "var(--cd-primary)" : "currentColor" }} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full relative">
        <Routes>
          <Route index element={<Navigate to="wallet" replace />} />
          <Route path="wallet" element={<CommunityWalletPage />} />
          <Route path="usage" element={<UsageDashboardPage />} />
          <Route path="add-funds" element={<AddFundsPage />} />
        </Routes>
      </div>
    </div>
  );
}
