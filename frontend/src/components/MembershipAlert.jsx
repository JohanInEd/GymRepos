export default function MembershipAlert({ members = [], onDismiss, onReview }) {
  const expiringMembers = members.filter(
    (member) => member.daysToExpire >= 0 && member.daysToExpire <= 5,
  );

  if (expiringMembers.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/60 p-4 shadow-sm dark:border-amber-900/70 dark:from-amber-950/40 dark:to-orange-950/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-amber-950 shadow-sm shadow-amber-500/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 9v4M12 17h.01M10.3 3.6 2.6 17a2 2 0 0 0 1.74 3h15.32a2 2 0 0 0 1.74-3L13.7 3.6a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
          <p className="text-sm font-bold text-amber-950 dark:text-amber-100">
            {expiringMembers.length} mensualidad{expiringMembers.length > 1 ? "es" : ""} por vencer
          </p>
          <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-200/80">
            {expiringMembers
              .map((member) => `${member.fullName} (${member.daysToExpire} dias)`)
              .join(", ")}
          </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReview}
            className="h-10 rounded-xl bg-amber-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-900 dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-300"
          >
            Revisar
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="h-10 rounded-xl border border-amber-300/80 bg-white/70 px-4 text-sm font-semibold text-amber-950 transition hover:bg-white dark:border-amber-700 dark:bg-transparent dark:text-amber-100 dark:hover:bg-amber-900/60"
            aria-label="Quitar alerta de mensualidades por vencer"
          >
            Quitar
          </button>
        </div>
      </div>
    </div>
  );
}
