import { formatDistanceToNow } from "date-fns";
import { useTeamUsage } from "../../hooks/useUsageAnalytics";
import { formatCredits } from "../../utils/credits";

export default function TeamUsageTable() {
  const { data: rows = [], isLoading } = useTeamUsage();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm" style={{ color: "var(--cd-text-muted)" }}>
        Loading team usage...
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border" style={{ borderColor: "var(--cd-border-subtle)" }}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ backgroundColor: "var(--cd-surface-2)" }}>
            <th className="px-5 py-3 font-semibold" style={{ color: "var(--cd-text-muted)" }}>
              Member
            </th>
            <th className="px-5 py-3 font-semibold text-right" style={{ color: "var(--cd-text-muted)" }}>
              Credits Used
            </th>
            <th className="px-5 py-3 font-semibold" style={{ color: "var(--cd-text-muted)" }}>
              Last Activity
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.memberId}
              className="border-t hover:bg-[var(--cd-hover)]"
              style={{ borderColor: "var(--cd-border-subtle)" }}
            >
              <td className="px-5 py-3 font-medium flex items-center gap-3" style={{ color: "var(--cd-text)" }}>
                <div className="relative shrink-0 w-8 h-8">
                  {row.memberAvatar ? (
                    <img
                      src={row.memberAvatar}
                      alt={row.memberName}
                      className="w-8 h-8 rounded-full object-cover border"
                      style={{ borderColor: "var(--cd-border-subtle)" }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                        if (sibling) sibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white select-none"
                    style={{
                      backgroundColor: "var(--cd-primary)",
                      display: row.memberAvatar ? 'none' : 'flex'
                    }}
                  >
                    {row.memberName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--cd-text)" }}>
                    {row.memberName}
                  </div>
                  {row.memberRole && (
                    <div className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
                      {row.memberRole}
                    </div>
                  )}
                </div>
              </td>
              <td
                className="px-5 py-3 text-right font-semibold tabular-nums"
                style={{ color: "var(--cd-primary)" }}
              >
                {formatCredits(row.creditsUsed)}
              </td>
              <td className="px-5 py-3 text-xs" style={{ color: "var(--cd-text-muted)" }}>
                {formatDistanceToNow(new Date(row.lastActivity), { addSuffix: true })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
