import { useMemo, useState } from "react";

const inputClass =
  "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-200 dark:focus:ring-gray-700";

const initialPaymentForm = {
  receivableId: "",
  memberName: "",
  planName: "",
  amount: "",
  method: "Efectivo",
};

const initialExpenseForm = {
  category: "Servicios",
  description: "",
  amount: "",
  expenseDate: new Date().toISOString().slice(0, 10),
  paymentMethod: "Transferencia",
  provider: "",
};

function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatCompactCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function getDaysOverdue(dueDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  return Math.max(0, Math.floor((today - due) / 86400000));
}

function PaymentStatusBadge({ status }) {
  const styles = {
    Paid: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    Failed: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
    Refunded: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };
  const labels = {
    Paid: "Pagado",
    Pending: "Pendiente",
    Failed: "Fallido",
    Refunded: "Reembolsado",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.Pending}`}>
      {labels[status] || "Pendiente"}
    </span>
  );
}

function MetricCard({ label, value, detail, tone = "default" }) {
  const valueStyles = {
    default: "text-gray-950 dark:text-white",
    positive: "text-emerald-700 dark:text-emerald-300",
    warning: "text-amber-700 dark:text-amber-300",
    negative: "text-rose-700 dark:text-rose-300",
  };
  const iconStyles = {
    default: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    positive: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
    negative: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
  };

  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconStyles[tone]}`}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <p className={`mt-3 text-2xl font-bold tracking-tight ${valueStyles[tone]}`}>{value}</p>
      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
    </article>
  );
}

function ActionButton({ title, description, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-4 text-left transition ${
        primary
          ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600"
          : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500 dark:hover:bg-gray-700"
      }`}
    >
      <span className="block text-sm font-semibold">{title}</span>
      <span className={`mt-1 block text-xs ${primary ? "text-gray-300 dark:text-gray-600" : "text-gray-500 dark:text-gray-400"}`}>
        {description}
      </span>
    </button>
  );
}

function PaymentForm({ receivables, currency, onCancel, onSubmit }) {
  const [form, setForm] = useState(initialPaymentForm);

  function selectReceivable(receivableId) {
    const receivable = receivables.find((item) => item.receivableId === receivableId);
    setForm(
      receivable
        ? {
            ...form,
            receivableId,
            memberName: receivable.memberName,
            planName: receivable.planName,
            amount: String(receivable.amount),
          }
        : initialPaymentForm,
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    const amount = Number(form.amount);

    if (!form.memberName.trim() || !form.planName.trim() || amount <= 0) {
      return;
    }

    onSubmit({
      ...form,
      amount,
      memberName: form.memberName.trim(),
      planName: form.planName.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">Registrar pago</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Selecciona una deuda o registra otro pago.</p>
        </div>
        <button type="button" onClick={onCancel} className="text-sm font-medium text-gray-500 hover:text-gray-950 dark:hover:text-white">
          Cerrar
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="space-y-1 text-sm xl:col-span-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Cuenta por cobrar</span>
          <select className={inputClass} value={form.receivableId} onChange={(event) => selectReceivable(event.target.value)}>
            <option value="">Otro pago</option>
            {receivables.map((receivable) => (
              <option key={receivable.receivableId} value={receivable.receivableId}>
                {receivable.memberName} - {formatCurrency(receivable.amount, currency)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Cliente</span>
          <input
            className={inputClass}
            value={form.memberName}
            onChange={(event) => setForm((current) => ({ ...current, memberName: event.target.value }))}
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Plan</span>
          <input
            className={inputClass}
            value={form.planName}
            onChange={(event) => setForm((current) => ({ ...current, planName: event.target.value }))}
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Monto</span>
          <input
            className={inputClass}
            type="number"
            min="1"
            value={form.amount}
            onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Medio de pago</span>
          <select
            className={inputClass}
            value={form.method}
            onChange={(event) => setForm((current) => ({ ...current, method: event.target.value }))}
          >
            <option>Efectivo</option>
            <option>Transferencia</option>
            <option>Tarjeta</option>
          </select>
        </label>

        <div className="flex items-end md:col-span-2 xl:col-span-4">
          <button type="submit" className="h-10 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600">
            Guardar pago
          </button>
        </div>
      </div>
    </form>
  );
}

function ExpenseForm({ onCancel, onSubmit }) {
  const [form, setForm] = useState(initialExpenseForm);

  function handleSubmit(event) {
    event.preventDefault();
    const amount = Number(form.amount);

    if (!form.description.trim() || amount <= 0) {
      return;
    }

    onSubmit({
      ...form,
      amount,
      description: form.description.trim(),
      provider: form.provider.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">Registrar gasto</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Clasifica el egreso para reflejarlo en el resumen y el grafico mensual.
          </p>
        </div>
        <button type="button" onClick={onCancel} className="text-sm font-medium text-gray-500 hover:text-gray-950 dark:hover:text-white">
          Cerrar
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Categoria</span>
          <select
            className={inputClass}
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
          >
            <option>Infraestructura</option>
            <option>Maquinaria</option>
            <option>Servicios</option>
          </select>
        </label>

        <label className="space-y-1 text-sm md:col-span-2 xl:col-span-1">
          <span className="font-medium text-gray-700 dark:text-gray-300">Descripcion</span>
          <input
            className={inputClass}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Concepto del gasto"
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Monto</span>
          <input
            className={inputClass}
            type="number"
            min="1"
            value={form.amount}
            onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Fecha del gasto</span>
          <input
            className={inputClass}
            type="date"
            value={form.expenseDate}
            onChange={(event) => setForm((current) => ({ ...current, expenseDate: event.target.value }))}
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Medio de pago</span>
          <select
            className={inputClass}
            value={form.paymentMethod}
            onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))}
          >
            <option>Efectivo</option>
            <option>Transferencia</option>
            <option>Tarjeta</option>
          </select>
        </label>

        <label className="space-y-1 text-sm md:col-span-2 xl:col-span-1">
          <span className="font-medium text-gray-700 dark:text-gray-300">Proveedor (opcional)</span>
          <input
            className={inputClass}
            value={form.provider}
            onChange={(event) => setForm((current) => ({ ...current, provider: event.target.value }))}
            placeholder="Nombre del proveedor"
          />
        </label>

        <div className="flex items-end">
          <button type="submit" className="h-10 w-full rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600">
            Guardar gasto
          </button>
        </div>
      </div>
    </form>
  );
}

export default function FinancialDashboard({
  summary,
  currency = "USD",
  memberCount = 0,
  isLoading = false,
  onRegisterPayment,
  onRegisterExpense,
}) {
  const [activeAction, setActiveAction] = useState(null);
  const [notice, setNotice] = useState("");

  const data = summary || {
    currentMonthRevenue: 0,
    previousMonthRevenue: 0,
    currentMonthExpenses: 0,
    currentMonthPaidPayments: 0,
    monthlyRevenue: [],
    accountsReceivable: [],
    recentExpenses: [],
    recentPayments: [],
  };

  const totals = useMemo(() => {
    const receivable = data.accountsReceivable.reduce((sum, item) => sum + item.amount, 0);
    const profit = data.currentMonthRevenue - data.currentMonthExpenses;
    const delta = data.currentMonthRevenue - data.previousMonthRevenue;
    const deltaPercentage = data.previousMonthRevenue ? (delta / data.previousMonthRevenue) * 100 : 0;
    return { receivable, profit, delta, deltaPercentage };
  }, [data]);

  const chartData = useMemo(
    () =>
      data.monthlyRevenue.map((item, index) => ({
        ...item,
        expenses: item.expenses || 0,
        users: index === data.monthlyRevenue.length - 1 ? memberCount : item.users || 0,
      })),
    [data.monthlyRevenue, memberCount],
  );

  const expensesByCategory = useMemo(
    () =>
      data.recentExpenses.reduce((totalsByCategory, expense) => {
        totalsByCategory[expense.category] = (totalsByCategory[expense.category] || 0) + expense.amount;
        return totalsByCategory;
      }, {}),
    [data.recentExpenses],
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        Cargando finanzas...
      </div>
    );
  }

  const maxMoney = Math.max(...chartData.flatMap((item) => [item.revenue, item.expenses]), 1);
  const maxUsers = Math.max(...chartData.map((item) => item.users), 1);
  const chartWidth = Math.max(chartData.length * 100, 100);
  const chartLinePoints = chartData
    .map((item, index) => {
      const x = (index + 0.5) * (chartWidth / chartData.length);
      const y = 190 - (item.users / maxUsers) * 150;
      return `${x},${y}`;
    })
    .join(" ");

  function finishAction(message) {
    setActiveAction(null);
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  function downloadReport() {
    const rows = [
      ["Resumen financiero"],
      ["Ingresos del mes", data.currentMonthRevenue],
      ["Gastos del mes", data.currentMonthExpenses],
      ["Utilidad neta", totals.profit],
      ["Cartera pendiente", totals.receivable],
      [],
      ["Cuentas por cobrar"],
      ["Cliente", "Plan", "Monto", "Fecha limite", "Dias vencidos"],
      ...data.accountsReceivable.map((item) => [
        item.memberName,
        item.planName,
        item.amount,
        item.dueDate,
        getDaysOverdue(item.dueDate),
      ]),
      [],
      ["Pagos recientes"],
      ["Cliente", "Plan", "Monto", "Estado", "Fecha"],
      ...data.recentPayments.map((item) => [
        item.memberName,
        item.planName,
        item.amount,
        item.status,
        item.paidAt || item.createdAt,
      ]),
      [],
      ["Gastos recientes"],
      ["Categoria", "Descripcion", "Monto", "Fecha", "Medio de pago", "Proveedor"],
      ...data.recentExpenses.map((item) => [
        item.category,
        item.description,
        item.amount,
        item.expenseDate || item.createdAt,
        item.paymentMethod || "",
        item.provider || "",
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(";"))
      .join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte-financiero-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    finishAction("Reporte financiero descargado.");
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Resumen financiero</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos, gastos, utilidad y cartera del mes actual.</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{data.currentMonthPaidPayments} pagos recibidos este mes</p>
      </div>

      {notice ? (
        <div role="status" className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Ingresos"
          value={formatCurrency(data.currentMonthRevenue, currency)}
          detail={`${totals.deltaPercentage >= 0 ? "+" : ""}${totals.deltaPercentage.toFixed(1)}% frente al mes anterior`}
          tone={totals.delta >= 0 ? "positive" : "negative"}
        />
        <MetricCard
          label="Gastos"
          value={formatCurrency(data.currentMonthExpenses, currency)}
          detail={`${((data.currentMonthExpenses / Math.max(data.currentMonthRevenue, 1)) * 100).toFixed(1)}% de los ingresos`}
          tone="warning"
        />
        <MetricCard
          label="Utilidad neta"
          value={formatCurrency(totals.profit, currency)}
          detail="Ingresos menos gastos registrados"
          tone={totals.profit >= 0 ? "positive" : "negative"}
        />
        <MetricCard
          label="Cartera pendiente"
          value={formatCurrency(totals.receivable, currency)}
          detail={`${data.accountsReceivable.length} clientes con saldo pendiente`}
          tone={totals.receivable > 0 ? "negative" : "positive"}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {["Infraestructura", "Maquinaria", "Servicios"].map((category) => (
          <article
            key={category}
            className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              {category}
            </p>
            <p className="mt-2 text-xl font-semibold text-gray-950 dark:text-white">
              {formatCurrency(expensesByCategory[category] || 0, currency)}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Gastos registrados en esta categoria</p>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-950 dark:text-white">Acciones rapidas</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Mantiene el resumen actualizado durante la operacion diaria.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ActionButton
            title="Registrar pago"
            description="Suma ingresos y descuenta cartera."
            onClick={() => setActiveAction(activeAction === "payment" ? null : "payment")}
            primary
          />
          <ActionButton
            title="Registrar gasto"
            description="Clasifica infraestructura, maquinaria o servicios."
            onClick={() => setActiveAction(activeAction === "expense" ? null : "expense")}
          />
          <ActionButton
            title="Descargar reporte"
            description="Exporta resumen, pagos y cartera en CSV."
            onClick={downloadReport}
          />
        </div>
      </div>

      {activeAction === "payment" ? (
        <PaymentForm
          key="payment-form"
          receivables={data.accountsReceivable}
          currency={currency}
          onCancel={() => setActiveAction(null)}
          onSubmit={(payment) => {
            onRegisterPayment(payment);
            finishAction("Pago registrado y resumen actualizado.");
          }}
        />
      ) : null}

      {activeAction === "expense" ? (
        <ExpenseForm
          key="expense-form"
          onCancel={() => setActiveAction(null)}
          onSubmit={(expense) => {
            onRegisterExpense(expense);
            finishAction("Gasto registrado y utilidad actualizada.");
          }}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-950 dark:text-white">Ingresos, gastos y usuarios</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Relacion mensual entre el movimiento financiero y los usuarios registrados.
              </p>
            </div>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-200">
              {totals.deltaPercentage >= 0 ? "+" : ""}
              {totals.deltaPercentage.toFixed(1)}%
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-emerald-500" />
              Ingresos
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-amber-500" />
              Gastos
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-0.5 w-5 bg-indigo-500" />
              Usuarios
            </span>
          </div>

          <div className="relative mt-5 h-72 border-b border-gray-200 px-2 dark:border-gray-700">
            <div className="absolute inset-x-2 bottom-8 top-0 flex items-end gap-3">
              {chartData.map((item) => {
                const revenueHeight = Math.max((item.revenue / maxMoney) * 100, 3);
                const expenseHeight = Math.max((item.expenses / maxMoney) * 100, 3);

                return (
                  <div key={item.month} className="flex h-full min-w-0 flex-1 items-end justify-center gap-1">
                    <div
                      className="w-1/3 rounded-t bg-emerald-500 transition-all"
                      style={{ height: `${revenueHeight}%` }}
                      title={`${item.month} - Ingresos: ${formatCurrency(item.revenue, currency)}`}
                    />
                    <div
                      className="w-1/3 rounded-t bg-amber-500 transition-all"
                      style={{ height: `${expenseHeight}%` }}
                      title={`${item.month} - Gastos: ${formatCurrency(item.expenses, currency)}`}
                    />
                  </div>
                );
              })}
            </div>

            <svg
              className="pointer-events-none absolute inset-x-2 bottom-8 top-0 h-[calc(100%-2rem)] w-[calc(100%-1rem)] overflow-visible text-indigo-600 dark:text-indigo-300"
              viewBox={`0 0 ${chartWidth} 200`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                points={chartLinePoints}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              {chartData.map((item, index) => {
                const x = (index + 0.5) * (chartWidth / chartData.length);
                const y = 190 - (item.users / maxUsers) * 150;

                return (
                  <g key={`${item.month}-users`}>
                    <circle cx={x} cy={y} r="5" fill="currentColor" vectorEffect="non-scaling-stroke" />
                    <text
                      x={x}
                      y={Math.max(y - 10, 16)}
                      textAnchor="middle"
                      fill="currentColor"
                      className="text-[11px] font-semibold"
                    >
                      {item.users}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute inset-x-2 bottom-0 flex gap-3">
              {chartData.map((item, index) => (
                <div
                  key={`${item.month}-label`}
                  className={`min-w-0 flex-1 py-2 text-center text-xs font-medium ${
                    index === chartData.length - 1
                      ? "text-sky-700 dark:text-sky-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.month}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Escala monetaria: hasta {formatCompactCurrency(maxMoney, currency)}</span>
            <span>Usuarios: hasta {maxUsers}</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-950 dark:text-white">Cartera por cobrar</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Saldos que requieren seguimiento.</p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {data.accountsReceivable.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No hay saldos pendientes.</p>
            ) : (
              data.accountsReceivable.map((receivable) => (
                <div key={receivable.receivableId} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-950 dark:text-white">{receivable.memberName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {receivable.planName} · Vencio {formatDate(receivable.dueDate)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300">{formatCurrency(receivable.amount, currency)}</p>
                    <p className="text-xs text-red-600 dark:text-red-400">{getDaysOverdue(receivable.dueDate)} dias vencido</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-950 dark:text-white">Pagos recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-900/70 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">Miembro</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {data.recentPayments.map((payment) => (
                  <tr key={payment.paymentId}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-950 dark:text-white">{payment.memberName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{payment.planName}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300">
                      {formatCurrency(payment.amount, payment.currency || currency)}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300">
                      {formatDateTime(payment.paidAt || payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-950 dark:text-white">Gastos recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-900/70 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">Concepto</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Pago</th>
                  <th className="px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {data.recentExpenses.map((expense) => (
                  <tr key={expense.expenseId}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-950 dark:text-white">{expense.category}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{expense.description}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300">
                      {formatCurrency(expense.amount, currency)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300">
                      <p>{expense.paymentMethod || "-"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{expense.provider || "Sin proveedor"}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300">
                      {expense.expenseDate ? formatDate(expense.expenseDate) : formatDateTime(expense.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
