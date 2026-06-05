import { useState } from "react";

const inputClass =
  "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-200 dark:focus:ring-gray-700";

const textAreaClass =
  "min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-950 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-200 dark:focus:ring-gray-700";

const initialPlanForm = {
  name: "",
  price: "",
  durationDays: "30",
  maxClasses: "",
  description: "",
};

const featureSuggestions = [
  {
    title: "Recordatorios automaticos",
    description: "Enviar avisos antes del vencimiento por WhatsApp, correo o SMS.",
  },
  {
    title: "Control de acceso avanzado",
    description: "Conectar torniquetes, QR o tarjetas al registro de entrada.",
  },
  {
    title: "Pagos y cartera",
    description: "Ver pagos pendientes, comprobantes, abonos y recaudo por plan.",
  },
  {
    title: "Progreso del cliente",
    description: "Guardar medidas, peso, fotos y rutinas para ver evolucion mensual.",
  },
];

function Field({ label, children }) {
  return (
    <label className="space-y-1 text-sm">
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {children}
    </label>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function GymSetup({ gymProfile, plans, onSaveGymProfile, onCreatePlan }) {
  const [profileForm, setProfileForm] = useState(gymProfile);
  const [planForm, setPlanForm] = useState(initialPlanForm);

  function updateProfileField(field, value) {
    setProfileForm((current) => ({ ...current, [field]: value }));
  }

  function updatePlanField(field, value) {
    setPlanForm((current) => ({ ...current, [field]: value }));
  }

  function handleProfileSubmit(event) {
    event.preventDefault();

    if (!profileForm.gymName.trim() || !profileForm.adminName.trim() || !profileForm.adminEmail.trim()) {
      return;
    }

    onSaveGymProfile({
      ...profileForm,
      gymName: profileForm.gymName.trim(),
      adminName: profileForm.adminName.trim(),
      adminEmail: profileForm.adminEmail.trim().toLowerCase(),
      adminPhone: profileForm.adminPhone.trim(),
      city: profileForm.city.trim(),
    });
  }

  function handlePlanSubmit(event) {
    event.preventDefault();

    if (!planForm.name.trim() || !planForm.price || !planForm.durationDays) {
      return;
    }

    onCreatePlan({
      id: crypto.randomUUID(),
      name: planForm.name.trim(),
      price: Number(planForm.price),
      durationDays: Number(planForm.durationDays),
      maxClasses: Number(planForm.maxClasses) || null,
      description: planForm.description.trim(),
    });

    setPlanForm(initialPlanForm);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6">
        <form
          onSubmit={handleProfileSubmit}
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex flex-col gap-3 border-b border-gray-200 pb-3 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-950 dark:text-white">Datos del gimnasio</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nombre comercial y usuario administrador.</p>
            </div>
            <button
              type="submit"
              className="h-10 rounded-md bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              Guardar gimnasio
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Nombre del gimnasio">
              <input
                className={inputClass}
                value={profileForm.gymName}
                onChange={(event) => updateProfileField("gymName", event.target.value)}
                placeholder="Power House Gym"
                required
              />
            </Field>

            <Field label="Ciudad">
              <input
                className={inputClass}
                value={profileForm.city}
                onChange={(event) => updateProfileField("city", event.target.value)}
                placeholder="Bogota"
              />
            </Field>

            <Field label="Nombre del usuario">
              <input
                className={inputClass}
                value={profileForm.adminName}
                onChange={(event) => updateProfileField("adminName", event.target.value)}
                placeholder="Administrador principal"
                required
              />
            </Field>

            <Field label="Correo del usuario">
              <input
                className={inputClass}
                type="email"
                value={profileForm.adminEmail}
                onChange={(event) => updateProfileField("adminEmail", event.target.value)}
                placeholder="admin@gimnasio.com"
                required
              />
            </Field>

            <Field label="Telefono">
              <input
                className={inputClass}
                value={profileForm.adminPhone}
                onChange={(event) => updateProfileField("adminPhone", event.target.value)}
                placeholder="+57 300 000 0000"
              />
            </Field>

            <Field label="Rol">
              <select
                className={inputClass}
                value={profileForm.adminRole}
                onChange={(event) => updateProfileField("adminRole", event.target.value)}
              >
                <option>Propietario</option>
                <option>Administrador</option>
                <option>Recepcion</option>
              </select>
            </Field>
          </div>
        </form>

        <form
          onSubmit={handlePlanSubmit}
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex flex-col gap-3 border-b border-gray-200 pb-3 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-950 dark:text-white">Registrar plan</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Crea planes que luego puedes asignar a clientes.</p>
            </div>
            <button
              type="submit"
              className="h-10 rounded-md bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              Agregar plan
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Nombre del plan">
              <input
                className={inputClass}
                value={planForm.name}
                onChange={(event) => updatePlanField("name", event.target.value)}
                placeholder="Mensual Plus"
                required
              />
            </Field>

            <Field label="Precio COP">
              <input
                className={inputClass}
                type="number"
                min="0"
                value={planForm.price}
                onChange={(event) => updatePlanField("price", event.target.value)}
                placeholder="95000"
                required
              />
            </Field>

            <Field label="Duracion dias">
              <input
                className={inputClass}
                type="number"
                min="1"
                value={planForm.durationDays}
                onChange={(event) => updatePlanField("durationDays", event.target.value)}
                required
              />
            </Field>

            <Field label="Clases incluidas">
              <input
                className={inputClass}
                type="number"
                min="0"
                value={planForm.maxClasses}
                onChange={(event) => updatePlanField("maxClasses", event.target.value)}
                placeholder="Ilimitadas"
              />
            </Field>

            <div className="md:col-span-2 xl:col-span-4">
              <Field label="Descripcion">
                <textarea
                  className={textAreaClass}
                  value={planForm.description}
                  onChange={(event) => updatePlanField("description", event.target.value)}
                  placeholder="Acceso a zona de pesas, cardio y clases grupales."
                />
              </Field>
            </div>
          </div>
        </form>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-950 dark:text-white">Planes registrados</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-900/70 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Duracion</th>
                  <th className="px-4 py-3">Clases</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {plans.map((plan) => (
                  <tr key={plan.id} className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-950 dark:text-white">{plan.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{plan.description || "Sin descripcion"}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatCurrency(plan.price)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{plan.durationDays} dias</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {plan.maxClasses ? plan.maxClasses : "Ilimitadas"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-base font-semibold text-gray-950 dark:text-white">{gymProfile.gymName}</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>{gymProfile.city || "Ciudad pendiente"}</p>
            <p>{gymProfile.adminName}</p>
            <p>{gymProfile.adminEmail}</p>
            <p>{gymProfile.adminRole}</p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-base font-semibold text-gray-950 dark:text-white">Sugerencias de funciones</h2>
          <div className="mt-4 space-y-3">
            {featureSuggestions.map((feature) => (
              <div key={feature.title} className="rounded-md border border-gray-200 p-3 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-950 dark:text-white">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
