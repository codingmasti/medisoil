import express from "express";
import {clerkMiddleware, requireAuth} from "@clerk/express";

import { cancelAppointment, confirmPayment, createAppointment, getAppointments, getAppointmentsByDoctor, getAppointmentsByPatient, getRegisteredUserCount, getStatus, updateAppointment } from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

appointmentRouter.get("/", getAppointments);
appointmentRouter.get("/confirm",confirmPayment);
appointmentRouter.get("/status/summary", getStatus);


//authentic routes
appointmentRouter.post("/", createAppointment);
appointmentRouter.get("/me", getAppointmentsByPatient);
// appointmentRouter.post("/", clerkMiddleware(), requireAuth(), createAppointment);
// appointmentRouter.get("/me", clerkMiddleware(), requireAuth(), getAppointmentsByPatient);

appointmentRouter.get("/doctor/:doctorId", getAppointmentsByDoctor);

appointmentRouter.post("/:id/cancel", cancelAppointment);
appointmentRouter.get("patents/count",getRegisteredUserCount);
appointmentRouter.put("/:id",updateAppointment);

export default appointmentRouter;