const express = require("express");
const Rating = require("../models/Rating");
const Request = require("../models/Request");
const Notification = require("../models/Notification");

const router = express.Router();

// ===================== ADD RATING & FEEDBACK =====================

router.post("/", async (req, res) => {
  try {
    const {
      requestId,
      skillId,
      skillName,
      reviewerEmail,
      reviewerName,
      teacherEmail,
      teacherName,
      rating,
      feedback,
    } = req.body;

    // ===================== REQUIRED FIELD CHECK =====================

    if (
      !skillId ||
      !skillName ||
      !reviewerEmail ||
      !reviewerName ||
      !teacherEmail ||
      !teacherName ||
      rating === undefined ||
      rating === null
    ) {
      return res.status(400).json({
        message: "All required fields are required.",
      });
    }

    // ===================== RATING VALIDATION =====================

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5.",
      });
    }

    // ===================== CLEAN EMAILS =====================

    const cleanReviewerEmail =
      reviewerEmail.trim().toLowerCase();

    const cleanTeacherEmail =
      teacherEmail.trim().toLowerCase();

    // ===================== OWN SKILL CHECK =====================

    if (
      cleanReviewerEmail === cleanTeacherEmail
    ) {
      return res.status(400).json({
        message: "You cannot rate your own skill.",
      });
    }

    // ===================== CHECK REQUEST =====================

    if (requestId) {
      const request =
        await Request.findById(requestId);

      if (!request) {
        return res.status(404).json({
          message: "Original request not found.",
        });
      }

      // Only accepted requests can be rated
      if (request.status !== "Accepted") {
        return res.status(400).json({
          message:
            "Only accepted skill requests can be rated.",
        });
      }

      // Check reviewer
      if (
        request.requesterEmail.toLowerCase() !==
        cleanReviewerEmail
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to rate this request.",
        });
      }

      // Check teacher
      if (
        request.teacherEmail.toLowerCase() !==
        cleanTeacherEmail
      ) {
        return res.status(400).json({
          message:
            "Teacher information does not match the request.",
        });
      }

      // Check duplicate rating
      const existingRating =
        await Rating.findOne({
          requestId: requestId,
          reviewerEmail: cleanReviewerEmail,
        });

      if (existingRating) {
        return res.status(400).json({
          message:
            "You have already rated this request.",
        });
      }
    }

    // ===================== CREATE RATING =====================

    const newRating = new Rating({
      requestId: requestId || undefined,

      skillId,

      skillName: skillName.trim(),

      reviewerEmail:
        cleanReviewerEmail,

      reviewerName:
        reviewerName.trim(),

      teacherEmail:
        cleanTeacherEmail,

      teacherName:
        teacherName.trim(),

      rating: numericRating,

      feedback:
        typeof feedback === "string"
          ? feedback.trim()
          : "",
    });

    await newRating.save();

    // ===================== CREATE NOTIFICATION =====================

    await Notification.create({
      userEmail: cleanTeacherEmail,

      type: "rating",

      title: "New Rating Received",

      message: `${reviewerName.trim()} gave you ${numericRating} ⭐ for ${skillName.trim()}.`,

      reviewerName:
        reviewerName.trim(),

      skillName:
        skillName.trim(),

      rating: numericRating,

      feedback:
        typeof feedback === "string"
          ? feedback.trim()
          : "",

      read: false,
    });

    // ===================== SUCCESS RESPONSE =====================

    return res.status(201).json({
      message:
        "Rating and feedback submitted successfully!",

      rating: newRating,
    });

  } catch (error) {
    console.error(
      "ADD RATING ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message || "Server error",
    });
  }
});

// ===================== GET RATINGS FOR TEACHER =====================

router.get(
  "/teacher/:email",
  async (req, res) => {
    try {
      const email =
        req.params.email
          .trim()
          .toLowerCase();

      const ratings =
        await Rating.find({
          teacherEmail: email,
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json(
        ratings
      );

    } catch (error) {
      console.error(
        "GET RATINGS ERROR:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Server error",
      });
    }
  }
);

module.exports = router;