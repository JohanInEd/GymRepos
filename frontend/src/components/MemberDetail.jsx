import MembershipCalendar from "./MembershipCalendar.jsx";

function Metric({ label, value, suffix }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-950">
        {value ? `${value}${suffix}` : "-"}
      </p>
    </div>
  );
}

export default function MemberDetail({ member }) {
  if (!member) {
    return (
      <aside className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Selecciona un usuario para ver su informacion.
      </aside>
    );
  }

  const metrics = member.bodyMetrics || {};

  return (
    <aside className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Perfil del cliente</p>
        <h2 className="text-xl font-semibold text-gray-950">{member.fullName}</h2>
        <p className="text-sm text-gray-500">{member.email}</p>
        <p className="text-sm text-gray-500">{member.phone || "Sin telefono"}</p>
      </div>

      <MembershipCalendar member={member} />

      <div className="grid grid-cols-2 gap-3">
        <Metric label="Estatura" value={metrics.heightCm} suffix=" cm" />
        <Metric label="Peso" value={metrics.weightKg} suffix=" kg" />
        <Metric label="Pecho" value={metrics.chestCm} suffix=" cm" />
        <Metric label="Cintura" value={metrics.waistCm} suffix=" cm" />
        <Metric label="Cadera" value={metrics.hipCm} suffix=" cm" />
        <Metric label="Genero" value={member.gender === "female" ? "Mujer" : "Hombre"} suffix="" />
      </div>
    </aside>
  );
}
