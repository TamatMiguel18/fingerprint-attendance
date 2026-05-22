const express = require("express");
const cors = require("cors");
const app = express();

const { PORT } = require("./config/env");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const activityRoutes = require("./routes/activityRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const webauthnRoutes = require("./routes/webauthnRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/webauthn", webauthnRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});