const express = require("express");

const User = require("../models/User");
const Request = require("../models/Request");
const Announcement = require("../models/Announcement");
const Skill = require("../models/Skill");

const router = express.Router();


// ======================================================
// GET ALL USERS
// ======================================================

router.get("/users", async (req, res) => {
  try {
    const users = await User.find(
      {},
      "-password"
    ).sort({
      createdAt: -1,
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(
      "GET USERS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to load users.",
    });
  }
});


// ======================================================
// BAN USER
// ======================================================

router.put(
  "/users/ban/:id",
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      user.isBanned = true;

      await user.save();

      return res.status(200).json({
        message:
          "User banned successfully.",
      });
    } catch (error) {
      console.error(
        "BAN USER ERROR:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Failed to ban user.",
      });
    }
  }
);


// ======================================================
// UNBAN USER
// ======================================================

router.put(
  "/users/unban/:id",
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      user.isBanned = false;

      await user.save();

      return res.status(200).json({
        message:
          "User unbanned successfully.",
      });
    } catch (error) {
      console.error(
        "UNBAN USER ERROR:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Failed to unban user.",
      });
    }
  }
);


// ======================================================
// GET ALL SWAP REQUESTS - ADMIN MONITOR
// ======================================================

router.get(
  "/requests",
  async (req, res) => {
    try {
      const requests =
        await Request.find({})
          .sort({
            createdAt: -1,
          });

      return res.status(200).json(
        requests
      );
    } catch (error) {
      console.error(
        "GET ADMIN REQUESTS ERROR:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Failed to load swap requests.",
      });
    }
  }
);


// ======================================================
// CREATE PLATFORM-WIDE ANNOUNCEMENT
// ======================================================

router.post(
  "/announcements",
  async (req, res) => {
    try {
      const {
        title,
        message,
      } = req.body;

      if (
        !title ||
        !title.trim() ||
        !message ||
        !message.trim()
      ) {
        return res.status(400).json({
          message:
            "Title and message are required.",
        });
      }

      const announcement =
        new Announcement({
          title: title.trim(),
          message: message.trim(),
          createdBy: "Admin",
        });

      await announcement.save();

      return res.status(201).json({
        message:
          "Announcement published successfully!",
        announcement,
      });
    } catch (error) {
      console.error(
        "CREATE ANNOUNCEMENT ERROR:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Failed to publish announcement.",
      });
    }
  }
);


// ======================================================
// GET ALL PLATFORM ANNOUNCEMENTS
// ======================================================

router.get(
  "/announcements",
  async (req, res) => {
    try {
      const announcements =
        await Announcement.find({})
          .sort({
            createdAt: -1,
          });

      return res.status(200).json(
        announcements
      );
    } catch (error) {
      console.error(
        "GET ANNOUNCEMENTS ERROR:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Failed to load announcements.",
      });
    }
  }
);


// ======================================================
// DELETE PLATFORM-WIDE ANNOUNCEMENT
// ======================================================

router.delete(
  "/announcements/:id",
  async (req, res) => {
    try {
      const announcement =
        await Announcement.findByIdAndDelete(
          req.params.id
        );

      if (!announcement) {
        return res.status(404).json({
          message:
            "Announcement not found.",
        });
      }

      return res.status(200).json({
        message:
          "Announcement deleted successfully.",
      });
    } catch (error) {
      console.error(
        "DELETE ANNOUNCEMENT ERROR:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Failed to delete announcement.",
      });
    }
  }
);


// ======================================================
// ADMIN - REPORT DATA
// ======================================================

router.get(
  "/reports",
  async (req, res) => {
    try {

      // ==================================================
      // USERS
      // ==================================================

      const totalUsers =
        await User.countDocuments();

      const bannedUsers =
        await User.countDocuments({
          isBanned: true,
        });

      const activeUsers =
        await User.countDocuments({
          isBanned: {
            $ne: true,
          },
        });


      // ==================================================
      // SKILLS
      // ==================================================

      const totalSkills =
        await Skill.countDocuments();

      const pendingSkills =
        await Skill.countDocuments({
          status: "pending",
        });

      const approvedSkills =
        await Skill.countDocuments({
          status: "approved",
        });

      const rejectedSkills =
        await Skill.countDocuments({
          status: "rejected",
        });


      // ==================================================
      // SWAP REQUESTS
      // ==================================================

      const totalRequests =
        await Request.countDocuments();

      const pendingRequests =
        await Request.countDocuments({
          status: "Pending",
        });

      const acceptedRequests =
        await Request.countDocuments({
          status: "Accepted",
        });

      /*
       * Current Request model supports:
       * Pending / Accepted / Rejected
       *
       * The Admin UI displays Rejected requests
       * as Cancelled.
       */
      const cancelledRequests =
        await Request.countDocuments({
          status: "Rejected",
        });


      // ==================================================
      // ANNOUNCEMENTS
      // ==================================================

      const totalAnnouncements =
        await Announcement.countDocuments();


      // ==================================================
      // SEND REPORT
      // ==================================================

      return res.status(200).json({
        users: {
          total: totalUsers,
          active: activeUsers,
          banned: bannedUsers,
        },

        skills: {
          total: totalSkills,
          pending: pendingSkills,
          approved: approvedSkills,
          rejected: rejectedSkills,
        },

        requests: {
          total: totalRequests,
          pending: pendingRequests,
          accepted: acceptedRequests,
          cancelled: cancelledRequests,
        },

        announcements: {
          total: totalAnnouncements,
        },
      });

    } catch (error) {
      console.error(
        "ADMIN REPORT ERROR:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Failed to generate admin report.",
      });
    }
  }
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;