function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
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

function PaymentStatusBadge({ status }) {
  const styles = {
    Paid: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Failed: "bg-red-100 text-red-800",
    Refunded: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}

export default function FinancialDashboard({ summary, currency = "USD", isLoading = false }) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        Cargando finanzas...
      </div>
    );
  }

  const data = summary || {
    currentMonthRevenue: 0,
    previousMonthRevenue: 0,
    monthOverMonthDelta: 0,
    currentMonthPaidPayments: 0,
    recentPayments: [],
  };

  const deltaIsPositive = data.monthOverMonthDelta >= 0;

  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Mes actual</p>
          <p className="mt-2 text-2xl font-semibold text-gray-950 dark:text-white">
            {formatCurrency(data.currentMonthRevenue, currency)}
          </p>
        </article>

        <article className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Mes anterior</p>
          <p className="mt-2 text-2xl font-semibold text-gray-950 dark:text-white">
            {formatCurrency(data.previousMonthRevenue, currency)}
          </p>
        </article>

        <article className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Variacion</p>
          <p className={`mt-2 text-2xl font-semibold ${deltaIsPositive ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
            {formatCurrency(data.monthOverMonthDelta, currency)}
          </p>
        </article>

        <article className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Pagos del mes</p>
          <p className="mt-2 text-2xl font-semibold text-gray-950 dark:text-white">{data.currentMonthPaidPayments}</p>
        </article>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-950 dark:text-white">Pagos recientes</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-900/70 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">Miembro</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.recentPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No hay pagos recientes.
                  </td>
                </tr>
              ) : (
                data.recentPayments.map((payment) => (
                  <tr key={payment.paymentId}>
                    <td className="px-4 py-3 font-medium text-gray-950 dark:text-white">{payment.memberName}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{payment.planName}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {formatCurrency(payment.amount, payment.currency || currency)}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {formatDateTime(payment.paidAt || payment.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
