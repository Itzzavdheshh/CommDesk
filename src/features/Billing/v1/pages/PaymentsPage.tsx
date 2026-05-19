import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Wallet, BarChart3, CreditCard } from "lucide-react";
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
      <div className="border-b shrink-0" style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 pt-6 sm:px-8 lg:px-10">
          <h1 className="text-2xl font-bold mb-5" style={{ color: "var(--cd-text)" }}>
            Payments
          </h1>
          <div className="flex items-center gap-6 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = location.pathname.includes(tab.path);
              return (
                <button
                  key={tab.key}
                  onClick={() => navigate(tab.path)}
                  className="flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                  style={{
                    borderColor: isActive ? "var(--cd-primary)" : "transparent",
                    color: isActive ? "var(--cd-text)" : "var(--cd-text-muted)"
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
