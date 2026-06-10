# Project Context

Workspace path: `D:\Consultas\SysG`

## Goal

Gym management SaaS with multi-tenant backend structure and a React/Tailwind admin dashboard.

## Stack

- Backend: C# ASP.NET Core Web API, Entity Framework Core, SQL Server structure.
- Frontend: React + Vite + Tailwind CSS.
- GitHub repo: `https://github.com/JohanInEd/GymRepos.git`
- Current development branch: `develop`

## Frontend

Location: `frontend/`

Run locally:

```bash
cd frontend
npm install
npm run dev
```

Build:

```bash
npm run build
```

The frontend has been validated with `npm run build`.

Main files:

- `frontend/src/App.jsx`
- `frontend/src/auth.js`
- `frontend/src/main.jsx`
- `frontend/src/index.css`
- `frontend/tailwind.config.js`
- `frontend/src/components/AccessManagement.jsx`
- `frontend/src/components/AuthScreen.jsx`
- `frontend/src/components/ClassSchedule.jsx`
- `frontend/src/components/ClientForm.jsx`
- `frontend/src/components/CheckInDashboard.jsx`
- `frontend/src/components/FinancialDashboard.jsx`
- `frontend/src/components/GymSetup.jsx`
- `frontend/src/components/MemberDetail.jsx`
- `frontend/src/components/MembersTable.jsx`
- `frontend/src/components/MembershipAlert.jsx`
- `frontend/src/components/MembershipCalendar.jsx`
- `frontend/src/components/OperationsDashboard.jsx`
- `frontend/src/components/Tabs.jsx`

Current UI features:

- Local demo authentication screen with active/inactive user validation.
- Role-based navigation and action permissions:
  - Owner: full access, including user management.
  - Administrator: finance, clients, check-in, memberships, classes, operations, and gym setup.
  - Reception: clients, check-in, memberships, and class reservations.
  - Trainer: read-only client access plus class scheduling and reservations.
- User management includes:
  - Creating users with a role and temporary password.
  - Activating and deactivating accounts.
  - Permission summaries per role.
  - Protection against deactivating the current user.
- Demo accounts use password `Demo123!`.
- Authentication is frontend-only mock behavior until the runnable backend and secure password storage are implemented.
- Classes tab includes:
  - Class scheduling with trainer, date, time, duration, capacity, and room.
  - Client reservations.
  - Duplicate-reservation prevention.
  - Capacity enforcement.
  - Expired-membership blocking.
  - Reservation cancellation and attendee lists.
- Operations tab includes:
  - Monthly expense budgets by category.
  - Budget utilization indicators.
  - Finance expense registrations automatically update matching operational budgets.
  - Equipment inventory, maintenance dates, and operational status.
  - Staff shift scheduling and commissions.
- Dark mode / light mode toggle in the header.
  - Uses Tailwind class-based dark mode (`darkMode: "class"`).
  - Stores the selected theme in `localStorage` under `gym-theme`.
  - Applies the `dark` class to `document.documentElement`.
- Permission-aware tabs: `Finanzas`, `Clientes`, `Check-in`, `Mensualidad`, `Clases`, `Operaciones`, `Gimnasio`, and `Usuarios`.
- Finance tab includes:
  - Current-month income, expenses, net profit, and outstanding receivables.
  - Six-month combined chart with income, expenses, and registered-user count.
  - Grouped income/expense bars use a monetary scale.
  - Registered users use a separate line scale.
  - Outstanding receivables list with due dates and overdue days.
  - Quick action to register a payment.
  - Quick action to register a categorized expense.
  - Expense categories: Infrastructure, Machinery, and Services.
  - Expenses include description, amount, date, payment method, and optional provider.
  - Category summary cards show the accumulated amount for each expense category.
  - CSV finance report download.
  - Registering a payment updates income, payment count, recent payments, the chart, and matching receivables.
  - Registering an expense updates expenses, net profit, category totals, recent expenses, and the chart.
  - The current chart user count follows the live number of clients in the frontend state.
- Client creation form with:
  - Nombre
  - Correo
  - Telefono
  - Genero
  - Plan
  - Estatura
  - Peso
  - Pecho
  - Cintura
  - Cadera
- Client creation plan options now come from the registered gym plans.
- Gym setup tab includes:
  - Gym name
  - City
  - Admin user name
  - Admin email
  - Admin phone
  - Admin role
  - Plan registration form
  - Registered plans table
  - Feature suggestions for future product work
- Registered plans include:
  - Plan name
  - Price in COP
  - Duration in days
  - Included classes
  - Description
- Adding a plan with an existing name updates the previous plan instead of duplicating it.
- Members table is clickable.
- Check-in tab includes:
  - Client search by name, email, phone, or plan.
  - Selected client access validation.
  - Only one active entry is allowed per client.
  - A new `Validar salida` action closes the active visit and enables a future entry.
  - Current people inside the gym are counted on the dashboard.
  - Entry registration for active and expiring memberships.
  - Blocked access registration when the membership is expired.
  - Daily counters for allowed entries, blocked attempts, and expiring plans.
  - Recent check-in history with result and reason.
- Membership table column has filter:
  - Todas
  - Activas
  - Por vencer
  - Vencidas
- Alert appears when at least one membership has `5` days or fewer remaining.
- Alert has:
  - `Revisar` button: opens `Mensualidad` tab and filters by `Por vencer`.
  - `Quitar` button: dismisses alert from the screen.
- Membership detail includes a mini calendar:
  - Editable start and end date inputs.
  - Previous / next month controls.
  - Full subscription range highlighted in sequence.
  - Used subscription days marked teal.
  - Pending subscription days marked sky blue.
  - Start date marked green.
  - End date marked red.
  - Today marked with dark ring.
  - Shows remaining days, total subscription length, and progress.
  - Date edits recalculate days remaining, membership status, badge color, filters, and alerts.
- Human silhouette component was removed.

## Backend

Location: `backend/src/`

Backend is currently a code structure, not a fully runnable ASP.NET project yet. There is no `.csproj` at the moment.

Main backend files:

- `backend/src/API/Controllers/DashboardController.cs`
- `backend/src/API/Controllers/CheckInController.cs`
- `backend/src/API/Controllers/SubscriptionController.cs`
- `backend/src/API/appsettings.json`
- `backend/src/API/appsettings.Development.json`
- `backend/src/API/Program.example.cs`
- `backend/src/Application/Abstractions/ITenantProvider.cs`
- `backend/src/Application/DTOs/Dashboard/*`
- `backend/src/Application/DTOs/CheckIns/*`
- `backend/src/Application/DTOs/Subscriptions/*`
- `backend/src/Application/Payments/*`
- `backend/src/Application/Services/IMembershipStatusService.cs`
- `backend/src/Application/Services/MembershipStatusService.cs`
- `backend/src/Domain/Common/ITenantScoped.cs`
- `backend/src/Domain/Entities/*`
- `backend/src/Domain/Enums/*`
- `backend/src/Infrastructure/DependencyInjection.cs`
- `backend/src/Infrastructure/Persistence/GymSaaSDbContext.cs`
- `backend/src/Infrastructure/Persistence/SqlServerOptions.cs`
- `backend/src/Infrastructure/Tenancy/HeaderTenantProvider.cs`

Backend domain entities:

- `Gym`
- `Plan`
- `Member`
- `Subscription`
- `Payment`
- `Attendance`

Multi-tenant structure:

- Tenant is represented by `Gym`.
- Tenant-scoped entities use `TenantId`.
- `GymSaaSDbContext` includes global query filters using `ITenantProvider`.
- `HeaderTenantProvider` reads tenant id from header `X-Tenant-Id`.
- `Attendance` records allowed and blocked check-in attempts per tenant/member.
- `Attendance` stores entry and optional exit timestamps for allowed visits.
- `CheckInController` exposes `POST /api/check-ins`, `POST /api/check-ins/check-out`, and `GET /api/check-ins/recent`.
- The backend rejects a second active entry and has a filtered unique index per tenant/member.

SQL Server structure added:

- `appsettings.json` has `ConnectionStrings:DefaultConnection`.
- `appsettings.Development.json` has local trusted SQL Server example.
- `DependencyInjection.cs` registers:
  - `GymSaaSDbContext`
  - SQL Server provider
  - `ITenantProvider`
  - `IMembershipStatusService`
  - `IHttpContextAccessor`
- `Program.example.cs` shows how to call `AddInfrastructure(builder.Configuration)`.

Important backend note:

- Since there is no `.csproj`, backend cannot be built with `dotnet build` yet.
- Next backend step would be creating proper ASP.NET project files or scaffolding a solution.

## Git Status Notes

Latest pushed commits:

- `bc260ce Initial gym SaaS dashboard`
- `c231be9 Add dismissible membership alerts and SQL Server structure`
- Latest commit: `Add gym setup tab and plan registration`

Current branch for ongoing feature work:

- `develop`

Most recent frontend changes:

- Added frontend demo authentication with Owner, Administrator, Reception, and Trainer roles.
- Added permission-filtered navigation and protected actions.
- Added user creation and account activation/deactivation.
- Added class scheduling, capacity management, client reservations, and cancellations.
- Added Operations for expense budgets, equipment maintenance, shifts, and commissions.
- Expanded expense registration with Infrastructure, Machinery, and Services categories.
- Added expense date, payment method, and optional provider fields.
- Added expense totals grouped by category.
- Replaced the revenue-only chart with a combined income, expenses, and users chart.
- Registering an expense now updates the current month's expense bar immediately.
- CSV finance exports now include the additional expense fields.
- Expanded the `Finanzas` tab with income, expense, net-profit, and receivables metrics.
- Added a six-month revenue chart and overdue receivables panel.
- Added working quick actions for payment registration, expense registration, and CSV report download.
- Finance quick actions update the in-memory dashboard data immediately.
- Added `Check-in` tab for entrance validation and attendance logging.
- Blocked access is recorded when a member plan is expired.
- Check-in dashboard shows daily allowed entries, blocked attempts, expiring plans, and recent history.
- Added `Gimnasio` tab for gym profile and admin user data.
- Added plan registration and registered plans table.
- Client creation form now uses registered plans as its plan options.
- Tabs layout now adapts to more than three tabs.
- Added suggested next features in the gym setup screen:
  - Automatic renewal reminders.
  - Check-in and access control.
  - Payments and overdue balances.
  - Client progress tracking.
- Frontend validated with `npm run build`.
- Updated `CONTEXT.md` with the current continuation notes.

In the next chat, first run:

```bash
git status --short
```

Then decide whether to commit and push these local changes.

If the working tree is clean, continue with the next requested feature.

## How To Continue In A New Chat

Paste this instruction:

```text
Continue from D:\Consultas\SysG. Read CONTEXT.md first, then run git status --short. Do not restart from scratch.
```
