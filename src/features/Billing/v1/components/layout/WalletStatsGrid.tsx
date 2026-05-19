import { Activity, Clock, Coins, Lock } from "lucide-react";
import type { Wallet } from "../../Billing.types";
import { formatCredits } from "../../utils/credits";

interface Props {
  wallet: Wallet;
  burnRatePerDay?: number;
}

export default function WalletStatsGrid({ wallet, burnRatePerDay = 52 }: Props) {
  const testIdFor = (label: string) =>
    `wallet-stat-${label.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "")}`;

  const stats = [
    {
      label: "Available",
      val: formatCredits(wallet.availableCredits),
      icon: Coins,
      color: "var(--cd-primary)",
    },
    {
      label: "Reserved",
      val: formatCredits(wallet.reservedCredits),
      icon: Lock,
      color: "var(--cd-warning)",
    },
    {
      label: "Burn Rate / day",
      val: formatCredits(burnRatePerDay),
      icon: Activity,
      color: "var(--cd-text)",
    },
    {
      label: "Lifetime Used",
      val: formatCredits(wallet.lifetimeUsedCredits),
      icon: Clock,
      color: "var(--cd-success)",
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border divide-y sm:divide-y-0 sm:divide-x overflow-hidden shadow-sm transition-shadow hover:shadow-md"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border)",
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          data-testid={testIdFor(stat.label)}
          className="p-6 flex flex-col gap-1 transition-colors hover:bg-[var(--cd-hover)]"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--cd-text-muted)] opacity-60">
            {stat.label}
          </span>
          <div className="flex items-center gap-2">
            <stat.icon size={16} style={{ color: stat.color }} />
            <span
              data-testid={`${testIdFor(stat.label)}-value`}
              className="text-2xl font-black tracking-tight"
              style={{ color: "var(--cd-text)" }}
            >
              {stat.val}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

