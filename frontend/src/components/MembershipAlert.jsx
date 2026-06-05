export default function MembershipAlert({ members = [], onDismiss, onReview }) {
  const expiringMembers = members.filter(
    (member) => member.daysToExpire >= 0 && member.daysToExpire <= 5,
  );

  if (expiringMembers.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-yellow-900">
            {expiringMembers.length} mensualidad{expiringMembers.length > 1 ? "es" : ""} por vencer
          </p>
          <p className="mt-1 text-sm text-yellow-800">
            {expiringMembers
              .map((member) => `${member.fullName} (${member.daysToExpire} dias)`)
              .join(", ")}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReview}
            className="h-10 rounded-md bg-yellow-900 px-4 text-sm font-semibold text-white transition hover:bg-yellow-800"
          >
            Revisar
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="h-10 rounded-md border border-yellow-300 bg-white px-4 text-sm font-semibold text-yellow-900 transition hover:bg-yellow-100"
            aria-label="Quitar alerta de mensualidades por vencer"
          >
            Quitar
          </button>
        </div>
      </div>
    </div>
  );
}
