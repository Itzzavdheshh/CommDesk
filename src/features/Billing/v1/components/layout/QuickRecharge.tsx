import { useState } from "react";
import { Loader2 } from "lucide-react";
import { formatRupees, buildAddFundsPreview, formatCredits } from "../../utils/credits";
import { useAddFunds } from "../../hooks/useWallet";
import { useToast } from "@/features/Tasks/v1/components/common/ToastNotification";
import { MIN_ADD_RUPEES } from "../../constants/billing.constants";

export default function QuickRecharge() {
  const addFunds = useAddFunds();
  const { addToast } = useToast();
  const [amountStr, setAmountStr] = useState("500");
  
  const handleRecharge = async () => {
    const amt = Number(amountStr) || 0;
    if (amt < MIN_ADD_RUPEES) {
      addToast("error", "Invalid Amount", `Minimum recharge is ₹${MIN_ADD_RUPEES}`);
      return;
    }
    
    try {
      await addFunds.mutateAsync({
        amountRupees: amt,
        paymentMethod: "upi",
        idempotencyKey: `quick-${Date.now()}`
      });
      addToast("success", "Recharge Successful", `Added ${formatCredits(amt * 10)} credits.`);
    } catch (e) {
      addToast("error", "Recharge Failed", "Please try again later.");
    }
  };

  const preview = buildAddFundsPreview(Number(amountStr) || 0);

  return (
     <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}>
       <h2 className="text-lg font-bold mb-4" style={{ color: "var(--cd-text)" }}>Quick Recharge</h2>
       
       <div className="grid grid-cols-3 gap-2 mb-4">
         {[150, 500, 1000].map(amt => (
           <button
             key={amt}
             onClick={() => setAmountStr(amt.toString())}
             className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${amountStr === amt.toString() ? 'border-[var(--cd-primary)] bg-[var(--cd-primary-subtle)]' : 'border-[var(--cd-border-subtle)] hover:bg-[var(--cd-hover)]'}`}
             style={{ 
               color: amountStr === amt.toString() ? "var(--cd-primary-text)" : "var(--cd-text)" 
             }}
           >
             ₹{amt} {amt === 500 && <span className="block text-[10px] opacity-70">Popular</span>}
           </button>
         ))}
       </div>
       
       <div className="mb-4">
         <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cd-text-muted)" }}>Custom Amount (₹)</label>
         <input 
           type="text" 
           inputMode="numeric"
           pattern="[0-9]*"
           value={amountStr}
           onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, "");
              const val = digitsOnly.replace(/^0+(?=\d)/, "");
              setAmountStr(val);
           }}
           className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent outline-none focus:ring-1 focus:ring-[var(--cd-primary)]"
           style={{ borderColor: "var(--cd-border-subtle)", color: "var(--cd-text)" }}
         />
       </div>

       <div className="flex justify-between items-center text-sm mb-4">
         <span style={{ color: "var(--cd-text-muted)" }}>You get:</span>
         <span className="font-bold" style={{ color: "var(--cd-primary)" }}>{formatCredits(preview.totalCredits)} cr</span>
       </div>

       <button
         onClick={() => void handleRecharge()}
         disabled={addFunds.isPending}
         className="cd-btn cd-btn-primary w-full rounded-xl py-2.5 font-semibold flex justify-center items-center gap-2"
       >
         {addFunds.isPending ? <Loader2 size={16} className="animate-spin" /> : `Pay ${formatRupees(preview.totalPayableRupees)}`}
       </button>
     </div>
  );
}
