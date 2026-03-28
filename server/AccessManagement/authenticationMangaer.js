import { ROLES, PRIVILEGED_ROLES, ALL_ROLES } from "./constants.js";

// ─── ROLE CHECKER UTILITY ─────────────────────────────────────────────────────
class RoleChecker {
    isValidRole(role) { return ALL_ROLES.includes(role); }

    isPatient(role) { return role === ROLES.PATIENT; }
    isDoctor(role) { return role === ROLES.DOCTOR; }
    isAdmin(role) { return role === ROLES.ADMIN; }

    isMedicalStaff(role) { return [ROLES.DOCTOR, ROLES.ADMIN].includes(role); }
    isPrivileged(role) { return PRIVILEGED_ROLES.includes(role); }

    hasAnyRole(role, ...allowedRoles) { return allowedRoles.includes(role); }

    getRoleLabel(role) {
        const labels = {
            [ROLES.PATIENT]: "Patient",
            [ROLES.DOCTOR]: "Doctor",
            [ROLES.ADMIN]: "Administrator",
        };
        return labels[role] ?? "Unknown";
    }

    getDashboardRoute(role) {
        const routes = {
            [ROLES.PATIENT]: "/patient/dashboard",
            [ROLES.DOCTOR]: "/doctor/dashboard",
            [ROLES.ADMIN]: "/admin/dashboard",
        };
        return routes[role] ?? "/";
    }
}

export default new RoleChecker();