import { useState } from "react";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  gender: "female",
  heightCm: "",
  weightKg: "",
  chestCm: "",
  waistCm: "",
  hipCm: "",
  planName: "Mensual",
};

function Field({ label, children }) {
  return (
    <label className="space-y-1 text-sm">
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-200 dark:focus:ring-gray-700";

export default function ClientForm({ onCreate, planOptions = ["Mensual", "VIP", "Anual"] }) {
  const [form, setForm] = useState(initialForm);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim()) {
      return;
    }

    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);

    onCreate({
      memberId: crypto.randomUUID(),
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      gender: form.gender,
      planName: form.planName,
      startDate: today.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      daysToExpire: 30,
      status: "Active",
      visualColor: "Green",
      tailwindClass: "bg-green-100 text-green-800",
      bodyMetrics: {
        heightCm: Number(form.heightCm) || null,
        weightKg: Number(form.weightKg) || null,
        chestCm: Number(form.chestCm) || null,
        waistCm: Number(form.waistCm) || null,
        hipCm: Number(form.hipCm) || null,
      },
    });

    setForm(initialForm);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3 dark:border-gray-700">
        <div>
          <h2 className="text-base font-semibold text-gray-950 dark:text-white">Crear cliente</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Datos basicos y medidas corporales.</p>
        </div>
        <button
          type="submit"
          className="h-10 rounded-md bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
        >
          Guardar
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Nombre">
          <input
            className={inputClass}
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Nombre completo"
            required
          />
        </Field>

        <Field label="Correo">
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="cliente@gym.com"
            required
          />
        </Field>

        <Field label="Telefono">
          <input
            className={inputClass}
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+57 300 000 0000"
          />
        </Field>

        <Field label="Genero">
          <select
            className={inputClass}
            value={form.gender}
            onChange={(event) => updateField("gender", event.target.value)}
          >
            <option value="female">Mujer</option>
            <option value="male">Hombre</option>
          </select>
        </Field>

        <Field label="Plan">
          <select
            className={inputClass}
            value={form.planName}
            onChange={(event) => updateField("planName", event.target.value)}
          >
            {planOptions.map((planName) => (
              <option key={planName}>{planName}</option>
            ))}
          </select>
        </Field>

        <Field label="Estatura cm">
          <input
            className={inputClass}
            type="number"
            min="0"
            value={form.heightCm}
            onChange={(event) => updateField("heightCm", event.target.value)}
            placeholder="170"
          />
        </Field>

        <Field label="Peso kg">
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.1"
            value={form.weightKg}
            onChange={(event) => updateField("weightKg", event.target.value)}
            placeholder="68.5"
          />
        </Field>

        <Field label="Pecho cm">
          <input
            className={inputClass}
            type="number"
            min="0"
            value={form.chestCm}
            onChange={(event) => updateField("chestCm", event.target.value)}
            placeholder="96"
          />
        </Field>

        <Field label="Cintura cm">
          <input
            className={inputClass}
            type="number"
            min="0"
            value={form.waistCm}
            onChange={(event) => updateField("waistCm", event.target.value)}
            placeholder="78"
          />
        </Field>

        <Field label="Cadera cm">
          <input
            className={inputClass}
            type="number"
            min="0"
            value={form.hipCm}
            onChange={(event) => updateField("hipCm", event.target.value)}
            placeholder="98"
          />
        </Field>
      </div>
    </form>
  );
}
