export const ROLES = Object.freeze({
    PATIENT: "Patient",
    DOCTOR: "Doctor",
    ADMIN: "Admin",
});

export const ALL_ROLES = Object.values(ROLES);
export const MEDICAL_ROLES = [ROLES.PATIENT, ROLES.DOCTOR];
export const PRIVILEGED_ROLES = [ROLES.DOCTOR, ROLES.ADMIN];

export const isPatientRole = (role) => role === ROLES.PATIENT;
export const isDoctorRole = (role) => role === ROLES.DOCTOR;
export const isAdminRole = (role) => role === ROLES.ADMIN;
export const isMedicalStaffRole = (role) => PRIVILEGED_ROLES.includes(role);
