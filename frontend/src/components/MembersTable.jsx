const statusStyles = {
  Active: {
    row: "bg-green-50",
    badge: "bg-green-100 text-green-800",
    label: "Activa",
  },
  ExpiringSoon: {
    row: "bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-800",
    label: "Por vencer",
  },
  Expired: {
    row: "bg-red-50",
    badge: "bg-red-100 text-red-800",
    label: "Vencida",
  },
  Pending: {
    row: "bg-gray-50",
    badge: "bg-gray-100 text-gray-800",
    label: "Pendiente",
  },
  Suspended: {
    row: "bg-gray-50",
    badge: "bg-gray-100 text-gray-800",
    label: "Suspendida",
  },
  Cancelled: {
    row: "bg-gray-50",
    badge: "bg-gray-100 text-gray-800",
    label: "Cancelada",
  },
};

function getStatusStyle(status, tailwindClass) {
  if (statusStyles[status]) {
    return statusStyles[status];
  }

  return {
    row: "bg-white",
    badge: tailwindClass || "bg-gray-100 text-gray-800",
    label: status || "Sin estado",
  };
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const [year, month, day] = String(value).split("-").map(Number);
  const date = year && month && day ? new Date(year, month - 1, day) : new Date(value);

  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export default function MembersTable({
  members = [],
  selectedMemberId,
  membershipFilter = "all",
  onMembershipFilterChange,
  onSelectMember,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Cargando miembros...
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
        No hay miembros para mostrar.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3">Miembro</th>
              <th className="px-4 py-3">
                <div className="flex min-w-44 flex-col gap-2">
                  <span>Mensualidad</span>
                  {onMembershipFilterChange ? (
                    <select
                      className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs font-medium normal-case text-gray-700 outline-none focus:border-gray-900"
                      value={membershipFilter}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => onMembershipFilterChange(event.target.value)}
                    >
                      <option value="all">Todas</option>
                      <option value="Active">Activas</option>
                      <option value="ExpiringSoon">Por vencer</option>
                      <option value="Expired">Vencidas</option>
                    </select>
                  ) : null}
                </div>
              </th>
              <th className="px-4 py-3">Inicio</th>
              <th className="px-4 py-3">Vence</th>
              <th className="px-4 py-3">Dias restantes</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => {
              const style = getStatusStyle(member.status, member.tailwindClass);

              return (
                <tr
                  key={member.memberId}
                  className={`${style.row} cursor-pointer transition-colors hover:bg-white ${
                    selectedMemberId === member.memberId ? "outline outline-2 outline-gray-900" : ""
                  }`}
                  onClick={() => onSelectMember?.(member)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-950">{member.fullName}</div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="font-medium text-gray-900">{member.planName}</div>
                    <div className="text-xs text-gray-500">{formatDate(member.startDate)} - {formatDate(member.endDate)}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(member.startDate)}</td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(member.endDate)}</td>
                  <td className="px-4 py-3 text-gray-700">{member.daysToExpire}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}>
                      {style.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
