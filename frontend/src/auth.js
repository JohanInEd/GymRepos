export const roleConfig = {
  owner: {
    label: "Propietario",
    description: "Acceso completo, usuarios, finanzas y configuracion.",
    permissions: ["finance", "clients", "checkin", "membership", "classes", "operations", "setup", "users"],
  },
  admin: {
    label: "Administrador",
    description: "Gestion operativa, financiera y comercial.",
    permissions: ["finance", "clients", "checkin", "membership", "classes", "operations", "setup"],
  },
  reception: {
    label: "Recepcion",
    description: "Clientes, mensualidades, reservas y control de acceso.",
    permissions: ["clients", "checkin", "membership", "classes"],
  },
  trainer: {
    label: "Entrenador",
    description: "Consulta de clientes y gestion de clases.",
    permissions: ["clients", "classes"],
  },
};

export function hasPermission(user, permission) {
  return Boolean(user?.active && roleConfig[user.role]?.permissions.includes(permission));
}

export function getRoleLabel(role) {
  return roleConfig[role]?.label || role;
}
