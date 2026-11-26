const express = require("express");
const Request = require("../models/Request");
const Notification = require("../models/Notification");

const router = express.Router();


// ===================== SEND REQUEST =====================

router.post("/add", async (req, res) => {
  try {
    const {
      skillId,
      skillName,
      category,
      level,
      teacherEmail,
      teacherName,
      requesterEmail,
      requesterName,
      message,
    } = req.body;

    // Check required fields
    if (
      !skillId ||
      !skillName ||
      !category ||
      !level ||
      !teacherEmail ||
      !teacherName ||
      !requesterEmail ||
      !requesterName ||
      !message
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const cleanTeacherEmail =
      teacherEmail.trim().toLowerCase();

    const cleanRequesterEmail =
      requesterEmail.trim().toLowerCase();

    // Prevent requesting own skill
    if (cleanTeacherEmail === cleanRequesterEmail) {
      return res.status(400).json({
        message: "You cannot request your own skill.",
      });
    }

    // Check duplicate pending request
    const existingRequest = await Request.findOne({
      skillId,
      requesterEmail: cleanRequesterEmail,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent.",
      });
    }

    // ===================== CREATE REQUEST =====================

    const request = new Request({
      skillId,
      skillName: skillName.trim(),
      category: category.trim(),
      level: level.trim(),

      teacherEmail: cleanTeacherEmail,
      teacherName: teacherName.trim(),

      requesterEmail: cleanRequesterEmail,
      requesterName: requesterName.trim(),

      message: message.trim(),

      status: "Pending",
    });

    await request.save();


    // ===================== CREATE NOTIFICATION =====================

    await Notification.create({
      userEmail: cleanTeacherEmail,

      type: "request",

      title: "New Skill Request",

      message: `${requesterName.trim()} sent you a request for ${skillName.trim()}.`,

      reviewerName: requesterName.trim(),

      skillName: skillName.trim(),

      rating: 0,

      feedback: message.trim(),

      read: false,
    });


    // ===================== SUCCESS =====================

    return res.status(201).json({
      message: "Skill request sent successfully!",
      request,
    });

  } catch (error) {
    console.error(
      "Send Request Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===================== GET MY SENT REQUESTS =====================

router.get("/my/:email", async (req, res) => {
  try {
    const email =
      req.params.email.trim().toLowerCase();

    const requests = await Request.find({
      requesterEmail: email,
    }).sort({ createdAt: -1 });

    return res.status(200).json(requests);

  } catch (error) {
    console.error(
      "Get My Requests Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===================== GET RECEIVED REQUESTS =====================

router.get("/received/:email", async (req, res) => {
  try {
    const email =
      req.params.email.trim().toLowerCase();

    const requests = await Request.find({
      teacherEmail: email,
    }).sort({ createdAt: -1 });

    return res.status(200).json(requests);

  } catch (error) {
    console.error(
      "Get Received Requests Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===================== UPDATE REQUEST STATUS =====================

router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Accepted",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid request status.",
      });
    }

    const request =
      await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    const oldStatus = request.status;

    request.status = status;

    await request.save();


    // ===================== STATUS NOTIFICATION =====================

    // Only create notification when status actually changes
    if (oldStatus !== status) {

      let notificationTitle = "";
      let notificationMessage = "";

      if (status === "Accepted") {

        notificationTitle =
          "Skill Request Accepted";

        notificationMessage =
          `${request.teacherName} accepted your request for ${request.skillName}.`;

      }

      if (status === "Rejected") {

        notificationTitle =
          "Skill Request Rejected";

        notificationMessage =
          `${request.teacherName} rejected your request for ${request.skillName}.`;

      }


      // Create notification only for Accepted / Rejected
      if (notificationTitle && notificationMessage) {

        await Notification.create({
          userEmail:
            request.requesterEmail
              .trim()
              .toLowerCase(),

          type:
            status === "Accepted"
              ? "request_accepted"
              : "request_rejected",

          title:
            notificationTitle,

          message:
            notificationMessage,

          reviewerName:
            request.teacherName,

          skillName:
            request.skillName,

          rating: 0,

          feedback: "",

          read: false,
        });
      }
    }


    return res.status(200).json({
      message:
        "Request status updated successfully!",

      request,
    });

  } catch (error) {
    console.error(
      "Update Request Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===================== DELETE PENDING REQUEST =====================

router.delete("/:id", async (req, res) => {
  try {
    const request =
      await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    // Only Pending requests can be deleted
    if (request.status !== "Pending") {
      return res.status(400).json({
        message:
          "Only pending requests can be deleted.",
      });
    }

    await Request.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      message: "Request deleted successfully!",
    });

  } catch (error) {
    console.error(
      "Delete Request Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});


module.exports = router;