import { useMemo, useState } from "react";

const statusStyles = {
  Active: {
    badge: "bg-green-100 text-green-800",
    label: "Activa",
  },
  ExpiringSoon: {
    badge: "bg-yellow-100 text-yellow-800",
    label: "Por vencer",
  },
  Expired: {
    badge: "bg-red-100 text-red-800",
    label: "Vencida",
  },
};

function getStatusStyle(status) {
  return statusStyles[status] || {
    badge: "bg-gray-100 text-gray-800",
    label: status || "Sin estado",
  };
}

function getDateKey(value) {
  const date = value ? new Date(value) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

function formatDateTime(value) {
  return new Intl.DateTimeFormat("es-CO", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getAccessDecision(member) {
  const isBlocked = !member || member.status === "Expired" || member.daysToExpire < 0;

  return {
    accessGranted: !isBlocked,
    title: isBlocked ? "Acceso bloqueado" : "Acceso permitido",
    description: isBlocked
      ? "La mensualidad esta vencida. Revisa la renovacion antes de permitir la entrada."
      : member.status === "ExpiringSoon"
        ? "Puede entrar hoy. La mensualidad esta por vencer."
        : "Puede entrar hoy con mensualidad activa.",
  };
}

function StatCard({ label, value, tone = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
    rose: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
    sky: "bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300",
  };

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}>
          <span className="h-2.5 w-2.5 rounded-full bg-current" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{value}</p>
    </article>
  );
}

export default function CheckInDashboard({
  members,
  attendanceLogs,
  selectedMemberId,
  onSelectMember,
  onCheckIn,
  onCheckOut,
  onReviewMembership,
}) {
  const [query, setQuery] = useState("");
  const [lastResult, setLastResult] = useState(null);

  const selectedMember = useMemo(
    () => members.find((member) => member.memberId === selectedMemberId) || members[0],
    [members, selectedMemberId],
  );

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return members;
    }

    return members.filter((member) => {
      const searchableText = [
        member.fullName,
        member.email,
        member.phone,
        member.planName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [members, query]);

  const todayLogs = useMemo(() => {
    const todayKey = getDateKey();

    return attendanceLogs.filter((log) => getDateKey(log.checkedAt) === todayKey);
  }, [attendanceLogs]);

  const accessDecision = getAccessDecision(selectedMember);
  const openAttendance = attendanceLogs.find(
    (log) => log.memberId === selectedMember?.memberId && log.accessGranted && !log.checkedOutAt,
  );
  const resultForSelected = lastResult?.memberId === selectedMember?.memberId ? lastResult : null;
  const selectedStatusStyle = getStatusStyle(selectedMember?.status);

  function handleSelectMember(memberId) {
    setLastResult(null);
    onSelectMember?.(memberId);
  }

  function handleCheckIn() {
    if (!selectedMember) {
      return;
    }

    const log = onCheckIn?.(selectedMember.memberId);

    if (log) {
      setLastResult(log);
    }
  }

  function handleCheckOut() {
    if (!selectedMember || !openAttendance) {
      return;
    }

    const log = onCheckOut?.(selectedMember.memberId);

    if (log) {
      setLastResult(log);
    }
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Entradas hoy" value={todayLogs.filter((log) => log.accessGranted).length} />
        <StatCard label="Accesos bloqueados" value={todayLogs.filter((log) => !log.accessGranted).length} tone="rose" />
        <StatCard label="Planes por vencer" value={members.filter((member) => member.status === "ExpiringSoon").length} tone="amber" />
        <StatCard label="Personas dentro" value={attendanceLogs.filter((log) => log.accessGranted && !log.checkedOutAt).length} tone="sky" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 pb-3 dark:border-gray-700">
              <h2 className="text-base font-semibold text-gray-950 dark:text-white">Check-in de entrada</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Busca un cliente y valida su ingreso.</p>
            </div>

            <div className="mt-4">
              <label className="space-y-1 text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Buscar cliente</span>
                <input
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-200 dark:focus:ring-gray-700"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Nombre, correo, telefono o plan"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {filteredMembers.length === 0 ? (
                <div className="rounded-md border border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400 md:col-span-2">
                  No hay clientes que coincidan con la busqueda.
                </div>
              ) : null}

              {filteredMembers.map((member) => {
                const style = getStatusStyle(member.status);
                const isSelected = selectedMember?.memberId === member.memberId;

                return (
                  <button
                    key={member.memberId}
                    type="button"
                    onClick={() => handleSelectMember(member.memberId)}
                    className={`min-h-24 rounded-md border p-3 text-left transition ${
                      isSelected
                        ? "border-gray-950 bg-gray-50 dark:border-white dark:bg-gray-900"
                        : "border-gray-200 bg-white hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-950 dark:text-white">{member.fullName}</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}>
                        {style.label}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <span>{member.planName}</span>
                      <span>Vence: {formatDate(member.endDate)}</span>
                      <span>{member.daysToExpire} dias</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h2 className="text-base font-semibold text-gray-950 dark:text-white">Registro reciente</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-900/70 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3">Entrada</th>
                    <th className="px-4 py-3">Salida</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Resultado</th>
                    <th className="px-4 py-3">Motivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {attendanceLogs.slice(0, 8).map((log) => (
                    <tr key={log.id} className="bg-white dark:bg-gray-800">
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDateTime(log.checkedAt)}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {log.checkedOutAt ? formatDateTime(log.checkedOutAt) : log.accessGranted ? "Dentro" : "-"}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-950 dark:text-white">{log.fullName}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.planName}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            log.accessGranted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {log.accessGranted ? "Permitido" : "Bloqueado"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          {selectedMember ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente seleccionado</p>
                <h2 className="mt-1 text-xl font-semibold text-gray-950 dark:text-white">{selectedMember.fullName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMember.email}</p>
              </div>

              <div className="rounded-md border border-gray-200 p-3 dark:border-gray-700">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Mensualidad</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selectedStatusStyle.badge}`}>
                    {selectedStatusStyle.label}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between gap-4">
                    <span>Plan</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{selectedMember.planName}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Vence</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(selectedMember.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Dias restantes</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedMember.daysToExpire}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-md border p-4 ${
                  resultForSelected
                    ? resultForSelected.accessGranted
                      ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                      : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                    : accessDecision.accessGranted
                      ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                      : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                }`}
                aria-live="polite"
              >
                <p
                  className={`text-lg font-semibold ${
                    resultForSelected
                      ? resultForSelected.accessGranted
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                      : accessDecision.accessGranted
                        ? "text-gray-950 dark:text-white"
                        : "text-red-800 dark:text-red-200"
                  }`}
                >
                  {resultForSelected
                    ? resultForSelected.action === "check-out"
                      ? "Salida registrada"
                      : resultForSelected.action === "duplicate"
                        ? "Entrada ya registrada"
                        : resultForSelected.accessGranted
                          ? "Entrada registrada"
                          : "Entrada bloqueada"
                    : openAttendance
                      ? "Cliente dentro del gimnasio"
                    : accessDecision.title}
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {resultForSelected
                    ? resultForSelected.reason
                    : openAttendance
                      ? `Entrada registrada ${formatDateTime(openAttendance.checkedAt)}. Valida la salida antes de registrar otro ingreso.`
                      : accessDecision.description}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={Boolean(openAttendance)}
                  className={`h-10 rounded-md px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 ${
                    accessDecision.accessGranted && !openAttendance
                      ? "bg-emerald-500 shadow-md shadow-emerald-500/20 hover:bg-emerald-600"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Validar entrada
                </button>
                <button
                  type="button"
                  onClick={handleCheckOut}
                  disabled={!openAttendance}
                  className="h-10 rounded-md border border-sky-600 bg-sky-50 px-4 text-sm font-semibold text-sky-800 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 dark:border-sky-500 dark:bg-sky-950/40 dark:text-sky-200 dark:hover:bg-sky-950/70 dark:disabled:border-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
                >
                  Validar salida
                </button>
                {!accessDecision.accessGranted ? (
                  <button
                    type="button"
                    onClick={() => onReviewMembership?.(selectedMember.memberId)}
                    className="h-10 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Revisar mensualidad
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay clientes disponibles para check-in.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
