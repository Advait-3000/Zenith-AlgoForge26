import express from "express";
import { bookAppointment, getMyAppointments } from "../controllers/appointment.controller.js";
import authMiddleware from "../utilities/verifyToken.js";

const router = express.Router();

/**
 * @route   POST /api/appointments/book
 * @desc    Patient books a clinic/hospital appointment
 * @access  Private (Patient/Staff)
 */
router.post("/book", authMiddleware, bookAppointment);

/**
 * @route   GET /api/appointments/my-appointments
 * @desc    Retrieve all appointments for the logged-in patient
 * @access  Private (Patient/Staff)
 */
router.get("/my-appointments", authMiddleware, getMyAppointments);

export default router;
