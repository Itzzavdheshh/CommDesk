import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2, Wallet } from "lucide-react";
import { RECHARGE_PACKS, MIN_ADD_RUPEES } from "../constants/billing.constants";
import { buildAddFundsPreview, formatCredits, formatRupees, validateMinAddFunds } from "../utils/credits";
import { useAddFunds } from "../hooks/useWallet";
import { ToastContainer, useToast } from "@/features/Tasks/v1/components/common/ToastNotification";
import type { PaymentState } from "../Billing.types";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI" },
  { id: "debit", label: "Debit Card" },
  { id: "credit", label: "Credit Card" },
  { id: "netbanking", label: "Net Banking" },
  { id: "wallet", label: "Wallets" },
] as const;

export default function AddFundsPage() {
  const navigate = useNavigate();
  const { toasts, addToast, dismiss } = useToast();
  const addFunds = useAddFunds();

  const [amountStr, setAmountStr] = useState("500");
  const amount = Number(amountStr) || 0;
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]["id"]>("upi");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [forceFail, setForceFail] = useState(false);

  const preview = buildAddFundsPreview(amount);
  const validation = validateMinAddFunds(amount);

  const handlePay = async () => {
    if (!validation.valid) {
      addToast("error", "Invalid amount", validation.error ?? "Check amount");
      return;
    }

    setPaymentState("processing");
    try {
      await addFunds.mutateAsync({
        amountRupees: amount,
        paymentMethod,
        idempotencyKey: `pay-${crypto.randomUUID()}${forceFail ? "-fail" : ""}`,
      });
      setPaymentState("success");
      addToast("success", "Payment successful", `${formatCredits(preview.totalCredits)} credits added.`);
    } catch {
      setPaymentState("failed");
      addToast("error", "Payment failed", "Please try again or use a different method.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: "var(--cd-bg)" }}>
      <div
        className="border-b px-5 py-5 sm:px-8 lg:px-10"
        style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}
      >
        <div className="mx-auto max-w-[1440px] flex items-center gap-4">
          <button
            onClick={() => navigate("/org/billing/wallet")}
            className="p-2 rounded-lg hover:bg-[var(--cd-hover)]"
          >
            <ArrowLeft size={18} style={{ color: "var(--cd-text-muted)" }} />
          </button>
          <div className="flex items-center gap-3">
            <Wallet size={20} style={{ color: "var(--cd-primary)" }} />
            <h1 className="text-xl font-semibold" style={{ color: "var(--cd-text)" }}>
              Add Funds
            </h1>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10 flex flex-col gap-8">
        {paymentState === "success" ? (
          <SuccessState
            credits={preview.totalCredits}
            onDone={() => navigate("/org/billing/wallet")}
          />
        ) : (
          <>
            <section>
              <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--cd-text-muted)" }}>
                Recharge packs
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {RECHARGE_PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setAmountStr(pack.amountRupees.toString())}
                    className="rounded-xl border p-4 text-left transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor:
                        amount === pack.amountRupees
                          ? "var(--cd-primary-subtle)"
                          : "var(--cd-surface)",
                      borderColor:
                        amount === pack.amountRupees
                          ? "var(--cd-primary)"
                          : "var(--cd-border-subtle)",
                    }}
                  >
                    <p className="text-xs font-medium" style={{ color: "var(--cd-text-muted)" }}>
                      {pack.label}
                    </p>
                    <p className="text-lg font-bold mt-1" style={{ color: "var(--cd-text)" }}>
                      {formatRupees(pack.amountRupees)}
                    </p>
                    <p className="text-sm mt-1" style={{ color: "var(--cd-primary)" }}>
                      {formatCredits(pack.baseCredits + pack.bonusCredits)} cr
                      {pack.bonusCredits > 0 && (
                        <span className="text-xs opacity-70"> (+{pack.bonusCredits} bonus)</span>
                      )}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="text-sm font-medium mb-2 block" style={{ color: "var(--cd-text)" }}>
                Custom amount ({"₹"}, min {MIN_ADD_RUPEES})
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min={MIN_ADD_RUPEES}
                step={50}
                value={amountStr}
                onChange={(e) => {
                  // Only allow digits
                  const digitsOnly = e.target.value.replace(/\D/g, "");
                  // Strip leading zeroes unless it's just "0"
                  const val = digitsOnly.replace(/^0+(?=\d)/, "");
                  setAmountStr(val);
                }}
                className="w-full rounded-xl border px-4 py-3 text-lg font-semibold bg-transparent"
                style={{ borderColor: "var(--cd-border-subtle)", color: "var(--cd-text)" }}
              />
              {!validation.valid && (
                <p className="text-xs mt-1" style={{ color: "var(--cd-danger)" }}>
                  {validation.error}
                </p>
              )}
            </section>

            <PreviewCard preview={preview} />

            <section>
              <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--cd-text-muted)" }}>
                Payment method
              </h2>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className="rounded-lg px-4 py-2 text-sm font-medium border transition-colors"
                    style={{
                      backgroundColor:
                        paymentMethod === m.id ? "var(--cd-primary-subtle)" : "var(--cd-surface)",
                      borderColor:
                        paymentMethod === m.id ? "var(--cd-primary)" : "var(--cd-border-subtle)",
                      color: paymentMethod === m.id ? "var(--cd-primary-text)" : "var(--cd-text-muted)",
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Test Simulation Controls */}
            <div
              className="border border-dashed p-4 rounded-xl flex items-center justify-between mt-2"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.05)",
                borderColor: "rgba(239, 68, 68, 0.3)",
              }}
            >
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--cd-danger)" }}>
                  Simulation Mode
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--cd-text-muted)" }}>
                  Force transaction failure for E2E testing
                </p>
              </div>
              <input
                type="checkbox"
                checked={forceFail}
                onChange={(e) => setForceFail(e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-red-500"
                id="force-fail-checkbox"
              />
            </div>

            <button
              onClick={() => void handlePay()}
              disabled={!validation.valid || addFunds.isPending || paymentState === "processing"}
              className="cd-btn cd-btn-primary w-full py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {addFunds.isPending || paymentState === "processing" ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Processing...
                </>
              ) : (
                <>Pay {formatRupees(preview.totalPayableRupees)}</>
              )}
            </button>
          </>
        )}
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

function PreviewCard({ preview }: { preview: ReturnType<typeof buildAddFundsPreview> }) {
  const rows = [
    { label: "You pay", value: formatRupees(preview.amountRupees) },
    { label: "GST (18%)", value: formatRupees(preview.gstRupees) },
    { label: "Platform fee", value: formatRupees(preview.platformFeeRupees) },
    { label: "Base credits", value: formatCredits(preview.baseCredits) },
    ...(preview.bonusCredits > 0
      ? [{ label: "Bonus credits", value: `+${formatCredits(preview.bonusCredits)}` }]
      : []),
  ];

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}
    >
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--cd-text)" }}>
        Order summary
      </h2>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between text-sm">
            <span style={{ color: "var(--cd-text-muted)" }}>{row.label}</span>
            <span style={{ color: "var(--cd-text)" }}>{row.value}</span>
          </div>
        ))}
        <div
          className="border-t pt-3 mt-3 flex justify-between font-bold"
          style={{ borderColor: "var(--cd-border-subtle)" }}
        >
          <span style={{ color: "var(--cd-text)" }}>Credits added</span>
          <span data-testid="credits-added-preview" style={{ color: "var(--cd-primary)" }}>
            {formatCredits(preview.totalCredits)}
          </span>
        </div>
      </div>
    </div>
  );
}

function SuccessState({ credits, onDone }: { credits: number; onDone: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-12">
      <CheckCircle2 size={48} style={{ color: "var(--cd-success)" }} />
      <h2 className="text-xl font-bold mt-4" style={{ color: "var(--cd-text)" }}>
        Payment successful
      </h2>
      <p className="text-sm mt-2" style={{ color: "var(--cd-text-muted)" }}>
        {formatCredits(credits)} credits have been added to your wallet.
      </p>
      <button onClick={onDone} className="cd-btn cd-btn-primary mt-8 px-8 py-2.5 rounded-xl">
        Back to wallet
      </button>
    </div>
  );
}
