import { ROLES } from "../AccessManagement/constants.js";

// ─── GENERIC ROLE GUARD ───────────────────────────────────────────────────────
export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in first." });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required Role: ${allowedRoles.join(" or ")}.`,
            });
        }
        next();
    };
};

// ─── PRE-BUILT ROLE GUARDS ──────────────────────────────────────────────────────
export const isPatient = requireRole(ROLES.PATIENT);
export const isDoctor = requireRole(ROLES.DOCTOR);
export const isAdmin = requireRole(ROLES.ADMIN);
export const isMedicalStaff = requireRole(ROLES.DOCTOR, ROLES.ADMIN, ROLES.PATIENT);