
import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import doctorRouter from "./routes/doctorRoute.js";
import serviceRouter from "./routes/serviceRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import serviceAppointmentRouter from "./routes/serviceAppointmentRouter.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
const port = 4000;

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174"
];

// Middleware
app.use(clerkMiddleware());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(express.json({ limit: "20mb" }));

// Routes
app.use("/api/doctors", doctorRouter);
app.use("/api/services", serviceRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/service-appointments", serviceAppointmentRouter);

// Home route
app.get("/", (req, res) => {
    res.send("Server is started");
});

// Start server after DB connection
const startServer = async () => {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error("Server failed to start:", error.message);
    }
};

startServer();