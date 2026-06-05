function parseDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(parseDate(value));
}

function getCalendarDays(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const firstDay = new Date(start.getFullYear(), start.getMonth(), 1);
  const calendarStart = new Date(firstDay);
  calendarStart.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    return date;
  });
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function MembershipCalendar({ member }) {
  if (!member) {
    return null;
  }

  const start = parseDate(member.startDate);
  const end = parseDate(member.endDate);
  const today = new Date();
  const todayKey = toDateKey(today);
  const startKey = member.startDate;
  const endKey = member.endDate;
  const calendarDays = getCalendarDays(member.startDate, member.endDate);
  const totalDays = Math.max(1, Math.ceil((end - start) / 86400000));
  const elapsedDays = clamp(Math.ceil((today - start) / 86400000), 0, totalDays);
  const remainingDays = Math.max(0, member.daysToExpire);
  const progress = clamp((elapsedDays / totalDays) * 100, 0, 100);
  const monthLabel = new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
  }).format(start);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-3 sm:flex-row sm:items-start sm:justify-between dark:border-gray-700">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mensualidad</p>
          <h3 className="text-lg font-semibold text-gray-950 dark:text-white">{member.planName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(member.startDate)} - {formatDate(member.endDate)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-950 px-4 py-3 text-center text-white dark:bg-white dark:text-gray-950">
          <p className="text-2xl font-semibold">{remainingDays}</p>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-300 dark:text-gray-600">dias restantes</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium capitalize text-gray-700 dark:text-gray-300">{monthLabel}</span>
          <span className="text-gray-500 dark:text-gray-400">{Math.round(progress)}% usado</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div className="h-full rounded-full bg-gray-950 dark:bg-white" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
        {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
          <div key={`${day}-${index}`} className="py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {calendarDays.map((date) => {
          const key = toDateKey(date);
          const isInMonth = date.getMonth() === start.getMonth();
          const isInRange = date >= start && date <= end;
          const isStart = key === startKey;
          const isEnd = key === endKey;
          const isToday = key === todayKey;

          return (
            <div
              key={key}
              className={`flex h-9 items-center justify-center rounded-md text-xs font-semibold ${
                isInRange ? "bg-gray-100 text-gray-950 dark:bg-gray-800 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"
              } ${!isInMonth ? "opacity-50" : ""} ${isStart ? "bg-green-100 text-green-800" : ""} ${
                isEnd ? "bg-red-100 text-red-800" : ""
              } ${isToday ? "ring-2 ring-gray-950 dark:ring-white" : ""}`}
              title={isStart ? "Inicio" : isEnd ? "Fin" : isToday ? "Hoy" : undefined}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-300">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-green-100 ring-1 ring-green-200" />
          Inicio
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-red-100 ring-1 ring-red-200" />
          Fin
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-white ring-2 ring-gray-950 dark:bg-gray-900 dark:ring-white" />
          Hoy
        </span>
      </div>
    </div>
  );
}
