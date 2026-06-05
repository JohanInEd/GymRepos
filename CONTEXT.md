# Project Context

Workspace path: `D:\Consultas\SysG`

## Goal

Gym management SaaS with multi-tenant backend structure and a React/Tailwind admin dashboard.

## Stack

- Backend: C# ASP.NET Core Web API, Entity Framework Core, SQL Server structure.
- Frontend: React + Vite + Tailwind CSS.
- GitHub repo: `https://github.com/JohanInEd/GymRepos.git`
- Branch: `main`

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
- `frontend/src/main.jsx`
- `frontend/src/index.css`
- `frontend/tailwind.config.js`
- `frontend/src/components/ClientForm.jsx`
- `frontend/src/components/FinancialDashboard.jsx`
- `frontend/src/components/MemberDetail.jsx`
- `frontend/src/components/MembersTable.jsx`
- `frontend/src/components/MembershipAlert.jsx`
- `frontend/src/components/MembershipCalendar.jsx`
- `frontend/src/components/Tabs.jsx`

Current UI features:

- Dark mode / light mode toggle in the header.
  - Uses Tailwind class-based dark mode (`darkMode: "class"`).
  - Stores the selected theme in `localStorage` under `gym-theme`.
  - Applies the `dark` class to `document.documentElement`.
- Tabs: `Finanzas`, `Clientes`, `Mensualidad`.
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
- Members table is clickable.
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
- `backend/src/API/Controllers/SubscriptionController.cs`
- `backend/src/API/appsettings.json`
- `backend/src/API/appsettings.Development.json`
- `backend/src/API/Program.example.cs`
- `backend/src/Application/Abstractions/ITenantProvider.cs`
- `backend/src/Application/DTOs/Dashboard/*`
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

Multi-tenant structure:

- Tenant is represented by `Gym`.
- Tenant-scoped entities use `TenantId`.
- `GymSaaSDbContext` includes global query filters using `ITenantProvider`.
- `HeaderTenantProvider` reads tenant id from header `X-Tenant-Id`.

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
- Latest commit: `Add dark and light theme toggle`

Most recent frontend changes:

- Editable membership calendar with month navigation.
- Subscription length is shown with a colored day sequence.
- Membership date edits update local React state and recalculate status.
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
