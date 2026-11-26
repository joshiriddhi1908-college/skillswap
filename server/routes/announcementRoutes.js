const express = require("express");
const router = express.Router();

const Announcement = require("../models/Announcement");

// ===================== GET ALL ANNOUNCEMENTS =====================

router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({
      createdAt: -1
    });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch announcements"
    });
  }
});

// ===================== CREATE ANNOUNCEMENT =====================

router.post("/", async (req, res) => {
  try {
    const { title, message, createdBy } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Title and message are required"
      });
    }

    const announcement = new Announcement({
      title,
      message,
      createdBy: createdBy || "Admin"
    });

    await announcement.save();

    res.status(201).json({
      message: "Announcement published successfully",
      announcement
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to publish announcement"
    });
  }
});

// ===================== DELETE ANNOUNCEMENT =====================

router.delete("/:id", async (req, res) => {
  try {
    const deletedAnnouncement =
      await Announcement.findByIdAndDelete(req.params.id);

    if (!deletedAnnouncement) {
      return res.status(404).json({
        message: "Announcement not found"
      });
    }

    res.json({
      message: "Announcement deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete announcement"
    });
  }
});

module.exports = router;