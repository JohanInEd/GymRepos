export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-1">
      <div className="grid gap-1 sm:grid-cols-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`h-10 rounded-md px-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-gray-950 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
