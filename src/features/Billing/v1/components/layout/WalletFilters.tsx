import { Search, X } from "lucide-react";
import type { CreditTransactionType, TransactionFilters } from "../../Billing.types";

interface Props {
  filters: TransactionFilters;
  onChange: (f: TransactionFilters) => void;
  filteredCount: number;
  totalCount: number;
}

const TYPE_OPTIONS: { value: CreditTransactionType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "CREDIT_PURCHASE", label: "Purchase" },
  { value: "USAGE_DEDUCTION", label: "Usage" },
  { value: "BONUS_CREDIT", label: "Bonus" },
  { value: "REFUND", label: "Refund" },
];

export default function WalletFiltersBar({ filters, onChange, filteredCount, totalCount }: Props) {
  return (
    <div
      className="sticky top-0 z-20 border-b px-4 py-3 sm:px-8 lg:px-10"
      style={{
        backgroundColor: "color-mix(in srgb, var(--cd-surface) 92%, transparent)",
        borderColor: "var(--cd-border-subtle)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-3">
        <div
          className="flex flex-1 min-w-[200px] items-center gap-2 rounded-lg border px-3 py-2"
          style={{
            backgroundColor: "var(--cd-surface)",
            borderColor: "var(--cd-border-subtle)",
          }}
        >
          <Search size={16} style={{ color: "var(--cd-text-muted)" }} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--cd-text)" }}
          />
          {filters.search && (
            <button onClick={() => onChange({ ...filters, search: "", page: 1 })}>
              <X size={14} style={{ color: "var(--cd-text-muted)" }} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((opt) => {
            const active = filters.type === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange({ ...filters, type: opt.value, page: 1 })}
                className="rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors"
                style={{
                  backgroundColor: active ? "var(--cd-primary-subtle)" : "var(--cd-surface)",
                  color: active ? "var(--cd-primary-text)" : "var(--cd-text-muted)",
                  borderColor: active ? "var(--cd-primary-subtle)" : "var(--cd-border-subtle)",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <span className="text-xs ml-auto" style={{ color: "var(--cd-text-muted)" }}>
          {filteredCount} of {totalCount} transactions
        </span>
      </div>
    </div>
  );
}
