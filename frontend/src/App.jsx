import { useEffect, useMemo, useState } from "react";
import ClientForm from "./components/ClientForm.jsx";
import FinancialDashboard from "./components/FinancialDashboard.jsx";
import MembershipAlert from "./components/MembershipAlert.jsx";
import MemberDetail from "./components/MemberDetail.jsx";
import MembersTable from "./components/MembersTable.jsx";
import Tabs from "./components/Tabs.jsx";

const dashboardSummary = {
  financialSummary: {
    currentMonthRevenue: 18450000,
    previousMonthRevenue: 15100000,
    monthOverMonthDelta: 3350000,
    currentMonthPaidPayments: 128,
    recentPayments: [
      {
        paymentId: "pay-001",
        memberName: "Laura Mendoza",
        planName: "VIP",
        amount: 180000,
        currency: "COP",
        status: "Paid",
        createdAt: "2026-06-03T14:10:00Z",
        paidAt: "2026-06-03T14:12:00Z",
      },
      {
        paymentId: "pay-002",
        memberName: "Carlos Rojas",
        planName: "Mensual",
        amount: 95000,
        currency: "COP",
        status: "Pending",
        createdAt: "2026-06-03T13:40:00Z",
        paidAt: null,
      },
      {
        paymentId: "pay-003",
        memberName: "Natalia Perez",
        planName: "Anual",
        amount: 890000,
        currency: "COP",
        status: "Paid",
        createdAt: "2026-06-02T21:00:00Z",
        paidAt: "2026-06-02T21:01:00Z",
      },
    ],
  },
  members: [
    {
      memberId: "mem-001",
      fullName: "Laura Mendoza",
      email: "laura@example.com",
      phone: "+57 300 111 2233",
      gender: "female",
      planName: "VIP",
      startDate: "2026-05-20",
      endDate: "2026-07-20",
      daysToExpire: 47,
      status: "Active",
      visualColor: "Green",
      tailwindClass: "bg-green-100 text-green-800",
      bodyMetrics: {
        heightCm: 168,
        weightKg: 62,
        chestCm: 91,
        waistCm: 70,
        hipCm: 96,
      },
    },
    {
      memberId: "mem-002",
      fullName: "Carlos Rojas",
      email: "carlos@example.com",
      phone: "+57 301 555 4488",
      gender: "male",
      planName: "Mensual",
      startDate: "2026-05-09",
      endDate: "2026-06-07",
      daysToExpire: 4,
      status: "ExpiringSoon",
      visualColor: "Yellow",
      tailwindClass: "bg-yellow-100 text-yellow-800",
      bodyMetrics: {
        heightCm: 178,
        weightKg: 81,
        chestCm: 103,
        waistCm: 86,
        hipCm: 94,
      },
    },
    {
      memberId: "mem-003",
      fullName: "Andres Silva",
      email: "andres@example.com",
      phone: "+57 302 777 9911",
      gender: "male",
      planName: "Mensual",
      startDate: "2026-04-01",
      endDate: "2026-05-01",
      daysToExpire: -33,
      status: "Expired",
      visualColor: "Red",
      tailwindClass: "bg-red-100 text-red-800",
      bodyMetrics: {
        heightCm: 174,
        weightKg: 89,
        chestCm: 108,
        waistCm: 98,
        hipCm: 101,
      },
    },
  ],
};

export default function App() {
  const [members, setMembers] = useState(dashboardSummary.members);
  const [selectedMemberId, setSelectedMemberId] = useState(dashboardSummary.members[0]?.memberId);
  const [activeTab, setActiveTab] = useState("clients");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [isMembershipAlertDismissed, setIsMembershipAlertDismissed] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("gym-theme") || "light");
  const isDarkMode = theme === "dark";

  const selectedMember = useMemo(
    () => members.find((member) => member.memberId === selectedMemberId) || members[0],
    [members, selectedMemberId],
  );

  const filteredMembers = useMemo(() => {
    if (membershipFilter === "all") {
      return members;
    }

    return members.filter((member) => member.status === membershipFilter);
  }, [members, membershipFilter]);

  const expiringMembersCount = useMemo(
    () => members.filter((member) => member.daysToExpire >= 0 && member.daysToExpire <= 5).length,
    [members],
  );

  useEffect(() => {
    setIsMembershipAlertDismissed(false);
  }, [expiringMembersCount]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("gym-theme", theme);
  }, [isDarkMode, theme]);

  function handleCreateMember(member) {
    setMembers((current) => [member, ...current]);
    setSelectedMemberId(member.memberId);
    setActiveTab("membership");
  }

  function calculateMembershipState(endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(`${endDate}T00:00:00`);
    const daysToExpire = Math.ceil((end - today) / 86400000);

    if (daysToExpire < 0) {
      return {
        daysToExpire,
        status: "Expired",
        visualColor: "Red",
        tailwindClass: "bg-red-100 text-red-800",
      };
    }

    if (daysToExpire <= 5) {
      return {
        daysToExpire,
        status: "ExpiringSoon",
        visualColor: "Yellow",
        tailwindClass: "bg-yellow-100 text-yellow-800",
      };
    }

    return {
      daysToExpire,
      status: "Active",
      visualColor: "Green",
      tailwindClass: "bg-green-100 text-green-800",
    };
  }

  function handleUpdateMembership(memberId, dates) {
    setMembers((current) =>
      current.map((member) =>
        member.memberId === memberId
          ? {
              ...member,
              ...dates,
              ...calculateMembershipState(dates.endDate),
            }
          : member,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 text-gray-950 transition-colors dark:bg-gray-900 dark:text-gray-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gym SaaS</p>
            <h1 className="text-2xl font-semibold tracking-normal text-gray-950 dark:text-white">
              Dashboard administrativo
            </h1>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Demo local con datos mock
            </div>
            <button
              type="button"
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              className="h-10 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              aria-pressed={isDarkMode}
            >
              {isDarkMode ? "Modo claro" : "Modo oscuro"}
            </button>
          </div>
        </header>

        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: "finance", label: "Finanzas" },
            { id: "clients", label: "Clientes" },
            { id: "membership", label: "Mensualidad" },
          ]}
        />

        {!isMembershipAlertDismissed ? (
          <MembershipAlert
            members={members}
            onDismiss={() => setIsMembershipAlertDismissed(true)}
            onReview={() => {
              setMembershipFilter("ExpiringSoon");
              setActiveTab("membership");
            }}
          />
        ) : null}

        {activeTab === "finance" ? (
          <FinancialDashboard summary={dashboardSummary.financialSummary} currency="COP" />
        ) : null}

        {activeTab === "clients" ? (
          <section className="space-y-6">
            <ClientForm onCreate={handleCreateMember} />

            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Clientes</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Haz click en un usuario para seleccionarlo.</p>
              </div>
              <MembersTable
                members={members}
                selectedMemberId={selectedMember?.memberId}
                membershipFilter={membershipFilter}
                onMembershipFilterChange={setMembershipFilter}
                onSelectMember={(member) => {
                  setSelectedMemberId(member.memberId);
                  setActiveTab("membership");
                }}
              />
            </div>
          </section>
        ) : null}

        {activeTab === "membership" ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <section className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Mensualidad</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selecciona un cliente para revisar fechas, estado y dias restantes.
                </p>
              </div>
              <MembersTable
                members={filteredMembers}
                selectedMemberId={selectedMember?.memberId}
                membershipFilter={membershipFilter}
                onMembershipFilterChange={setMembershipFilter}
                onSelectMember={(member) => setSelectedMemberId(member.memberId)}
              />
            </section>

            <MemberDetail member={selectedMember} onUpdateMembership={handleUpdateMembership} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
