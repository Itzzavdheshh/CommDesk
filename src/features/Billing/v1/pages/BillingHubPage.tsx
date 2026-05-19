import { useNavigate } from "react-router-dom";
import { BarChart3, CreditCard, Wallet } from "lucide-react";
import { useWallet } from "../hooks/useWallet";
import CreditBadge from "../components/common/CreditBadge";
import { formatCredits } from "../utils/credits";
import QuickRecharge from "../components/layout/QuickRecharge";
import PayoutAccountDetails from "../components/layout/PayoutAccountDetails";
import { ToastContainer, useToast } from "@/features/Tasks/v1/components/common/ToastNotification";

const LINKS = [
  {
    title: "Community Wallet",
    description: "View balance, transactions, and team usage",
    path: "/org/billing/wallet",
    icon: Wallet,
  },
  {
    title: "Add Funds",
    description: "Purchase credits with UPI, cards, or net banking",
    path: "/org/billing/add-funds",
    icon: CreditCard,
  },
  {
    title: "Usage Analytics",
    description: "Burn rate, forecasts, and feature breakdown",
    path: "/org/billing/usage",
    icon: BarChart3,
  },
];

export default function BillingHubPage() {
  const navigate = useNavigate();
  const { data: wallet } = useWallet();
  const { toasts, dismiss } = useToast();

  return (
    <div className="w-full min-h-screen p-6 sm:p-10" style={{ backgroundColor: "var(--cd-bg)" }}>
      <div className="mx-auto max-w-[1440px]">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--cd-text)" }}>
          Billing & Credits
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--cd-text-muted)" }}>
          Manage your community wallet, add funds, and track usage. {"₹"}10 = 100 credits.
        </p>

        {wallet && (
          <div
            className="rounded-2xl border p-6 mb-8"
            style={{
              backgroundColor: "var(--cd-surface)",
              borderColor: "var(--cd-border-subtle)",
            }}
          >
            <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "var(--cd-text-muted)" }}>
              Available balance
            </p>
            <CreditBadge credits={wallet.availableCredits} size="lg" />
            <p className="text-xs mt-3" style={{ color: "var(--cd-text-muted)" }}>
              {formatCredits(wallet.pendingCredits)} pending · {formatCredits(wallet.reservedCredits)}{" "}
              reserved · {formatCredits(wallet.lockedCredits)} locked
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="rounded-2xl border p-6 text-left transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{
                backgroundColor: "var(--cd-surface)",
                borderColor: "var(--cd-border-subtle)",
              }}
            >
              <link.icon size={24} style={{ color: "var(--cd-primary)" }} />
              <h2 className="font-semibold mt-4" style={{ color: "var(--cd-text)" }}>
                {link.title}
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--cd-text-muted)" }}>
                {link.description}
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PayoutAccountDetails />
          <QuickRecharge />
        </div>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
