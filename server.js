const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const requestRoutes = require("./routes/requestRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// ===================== MIDDLEWARE =====================

app.use(cors());

app.use(express.json());

// ===================== ROUTES =====================

app.use("/api/auth", authRoutes);

app.use("/api/skills", skillRoutes);

app.use("/api/requests", requestRoutes);

app.use("/api/ratings", ratingRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/announcements", announcementRoutes);

app.use(
  "/api/notifications",
  notificationRoutes
);

// ===================== TEST ROUTE =====================

app.get("/", (req, res) => {
  res.send("SkillSwap Backend is Running!");
});

// ===================== MONGODB + SERVER =====================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB Connected Successfully"
    );

    app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(
      "MongoDB Connection Failed"
    );

    console.log(error.message);
  });