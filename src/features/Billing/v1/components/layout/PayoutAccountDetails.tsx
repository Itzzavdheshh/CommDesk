import { useState } from "react";
import { CheckCircle2, Landmark, Save } from "lucide-react";
import { useToast } from "@/features/Tasks/v1/components/common/ToastNotification";

export default function PayoutAccountDetails() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifsc: ""
  });

  const handleSave = () => {
    if (!form.accountHolder || !form.bankName || !form.accountNumber || !form.ifsc) {
      addToast("error", "Incomplete Form", "Please fill out all banking details.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      addToast("success", "Bank Details Saved", "Your payout account has been updated.");
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border-subtle)",
        boxShadow: "0 14px 34px var(--cd-shadow)",
      }}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black" style={{ color: "var(--cd-text)" }}>Payout Account Details</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--cd-text-muted)" }}>Receive funds and revenue securely to your bank account.</p>
        </div>
        <div className="rounded-xl p-3" style={{ backgroundColor: "var(--cd-success-subtle)", color: "var(--cd-success)" }}>
          <Landmark size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cd-text-muted)" }}>Account Holder Name</label>
          <input
            type="text"
            value={form.accountHolder}
            onChange={(e) => setForm({ ...form, accountHolder: e.target.value })}
            className="w-full rounded-xl border px-3 py-2.5 text-sm bg-transparent outline-none focus:ring-4 focus:ring-[var(--cd-primary-subtle)]"
            style={{ borderColor: "var(--cd-border-subtle)", color: "var(--cd-text)" }}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cd-text-muted)" }}>Bank Name</label>
          <input
            type="text"
            value={form.bankName}
            onChange={(e) => setForm({ ...form, bankName: e.target.value })}
            className="w-full rounded-xl border px-3 py-2.5 text-sm bg-transparent outline-none focus:ring-4 focus:ring-[var(--cd-primary-subtle)]"
            style={{ borderColor: "var(--cd-border-subtle)", color: "var(--cd-text)" }}
            placeholder="HDFC Bank"
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cd-text-muted)" }}>Account Number</label>
          <input
            type="password"
            value={form.accountNumber}
            onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
            className="w-full rounded-xl border px-3 py-2.5 text-sm bg-transparent outline-none focus:ring-4 focus:ring-[var(--cd-primary-subtle)]"
            style={{ borderColor: "var(--cd-border-subtle)", color: "var(--cd-text)" }}
            placeholder="********4567"
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cd-text-muted)" }}>IFSC / Swift Code</label>
          <input
            type="text"
            value={form.ifsc}
            onChange={(e) => setForm({ ...form, ifsc: e.target.value.toUpperCase() })}
            className="w-full rounded-xl border px-3 py-2.5 text-sm bg-transparent outline-none focus:ring-4 focus:ring-[var(--cd-primary-subtle)]"
            style={{ borderColor: "var(--cd-border-subtle)", color: "var(--cd-text)" }}
            placeholder="HDFC0001234"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading || saved}
          className="cd-btn cd-btn-secondary px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          {loading ? <div className="animate-spin h-4 w-4 border-2 border-[var(--cd-text)] border-t-transparent rounded-full" /> :
           saved ? <CheckCircle2 size={16} className="text-green-500" /> : <Save size={16} />}
          {saved ? "Saved" : "Save Details"}
        </button>
      </div>
    </div>
  );
}
