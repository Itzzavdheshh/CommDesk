import { useNavigate } from "react-router-dom";
import { Plus, Wallet, ArrowLeft } from "lucide-react";
import type { Wallet as WalletType } from "../../Billing.types";
import CreditBadge from "../common/CreditBadge";
import { formatCredits } from "../../utils/credits";

interface Props {
  wallet: WalletType | undefined;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "transactions", label: "Transactions" },
  { key: "team", label: "Team Usage" },
];

export default function WalletHeader({ wallet, activeTab, onTabChange }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="border-b flex flex-col transition-all duration-300"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border-subtle)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-3 relative">
          <button
            onClick={() => navigate("/org/billing")}
            className="absolute right-[100%] mr-1 sm:mr-2 p-1 rounded-lg hover:bg-[var(--cd-hover)] transition-colors text-[var(--cd-text-muted)] hover:text-[var(--cd-text)] hidden sm:block"
            aria-label="Go back to billing hub"
          >
            <ArrowLeft size={18} />
          </button>
          <WalletIconBox />
          <WalletTitle wallet={wallet} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/org/billing/usage")}
            className="cd-btn cd-btn-secondary h-9 rounded-lg px-3.5 text-sm hidden sm:inline-flex"
          >
            Usage
          </button>
          <button
            onClick={() => navigate("/org/billing/add-funds")}
            className="cd-btn cd-btn-primary h-9 rounded-lg px-3.5 text-sm shadow-none transition-all sm:px-4"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span className="hidden font-medium sm:inline">Add Funds</span>
          </button>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--cd-border-subtle)" }}>
        <div className="mx-auto flex w-full max-w-[1440px] items-center overflow-x-auto px-5 sm:px-8 lg:px-10">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className="group relative flex items-center gap-2 px-3.5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap"
                style={{ color: isActive ? "var(--cd-text)" : "var(--cd-text-muted)" }}
              >
                {tab.label}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full transition-all duration-300 ${isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
                  style={{ backgroundColor: "var(--cd-primary)" }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WalletIconBox() {
  return (
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
      style={{
        backgroundColor: "var(--cd-primary-subtle)",
        color: "var(--cd-primary-text)",
      }}
    >
      <Wallet size={18} strokeWidth={2.25} />
    </div>
  );
}

function WalletTitle({ wallet }: { wallet: WalletType | undefined }) {
  return (
    <div className="min-w-0">
      <h1
        className="truncate text-xl font-semibold leading-tight tracking-tight"
        style={{ color: "var(--cd-text)" }}
      >
        Community Wallet
      </h1>
        <div className="mt-1 truncate text-sm flex items-center gap-1 flex-wrap" style={{ color: "var(--cd-text-2)" }}>
          {wallet ? (
            <>
              <CreditBadge credits={wallet.availableCredits} size="sm" />
              <span>available · {formatCredits(wallet.reservedCredits)} reserved</span>
            </>
          ) : (
            "Manage credits, billing, and usage"
          )}
        </div>
    </div>
  );
}
