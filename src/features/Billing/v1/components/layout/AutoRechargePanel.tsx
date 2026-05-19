import { useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Wallet } from "../../Billing.types";
import { useAutoRecharge } from "../../hooks/useWallet";
import { MIN_ADD_RUPEES } from "../../constants/billing.constants";

interface Props {
  wallet: Wallet;
  onSuccess?: () => void;
}

export default function AutoRechargePanel({ wallet, onSuccess }: Props) {
  const autoRecharge = useAutoRecharge();
  const [enabled, setEnabled] = useState(wallet.autoRechargeEnabled);
  const [threshold, setThreshold] = useState(wallet.autoRechargeThreshold);
  const [amount, setAmount] = useState(wallet.autoRechargeAmountRupees);

  const handleSave = async () => {
    await autoRecharge.mutateAsync({
      enabled,
      thresholdCredits: threshold,
      rechargeAmountRupees: amount,
    });
    onSuccess?.();
  };

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border-subtle)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw size={18} style={{ color: "var(--cd-primary)" }} />
        <h3 className="font-semibold" style={{ color: "var(--cd-text)" }}>
          Auto Recharge
        </h3>
      </div>

      <label className="flex items-center gap-3 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="w-4 h-4 rounded accent-[var(--cd-primary)]"
        />
        <span className="text-sm" style={{ color: "var(--cd-text)" }}>
          Automatically recharge when balance drops below threshold
        </span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--cd-text-muted)" }}>
            Threshold (credits)
          </label>
          <input
            type="number"
            min={0}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            disabled={!enabled}
            className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
            style={{ borderColor: "var(--cd-border-subtle)", color: "var(--cd-text)" }}
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--cd-text-muted)" }}>
            Recharge amount ({"₹"}, min {MIN_ADD_RUPEES})
          </label>
          <input
            type="number"
            min={MIN_ADD_RUPEES}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={!enabled}
            className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
            style={{ borderColor: "var(--cd-border-subtle)", color: "var(--cd-text)" }}
          />
        </div>
      </div>

      <button
        onClick={() => void handleSave()}
        disabled={autoRecharge.isPending}
        className="cd-btn cd-btn-primary px-4 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        {autoRecharge.isPending ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
