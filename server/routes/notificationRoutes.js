const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

// ===================== GET NOTIFICATIONS =====================

router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email
      .trim()
      .toLowerCase();

    const notifications =
      await Notification.find({
        userEmail: email,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error(
      "GET NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message || "Server error",
    });
  }
});

// ===================== MARK AS READ =====================

router.patch("/:id/read", async (req, res) => {
  try {
    const notification =
      await Notification.findByIdAndUpdate(
        req.params.id,
        {
          read: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    return res.status(200).json(notification);
  } catch (error) {
    console.error(
      "MARK NOTIFICATION READ ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message || "Server error",
    });
  }
});

module.exports = router;