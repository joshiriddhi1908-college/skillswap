const express = require("express");
const Skill = require("../models/Skill");

const router = express.Router();

// ===================== ADD SKILL =====================
router.post("/add", async (req, res) => {
  try {
    const {
      skillName,
      category,
      level,
      description,
      userEmail,
      userName,
    } = req.body;

    if (
      !skillName ||
      !category ||
      !level ||
      !description ||
      !userEmail ||
      !userName
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const skill = new Skill({
      skillName: skillName.trim(),
      category: category.trim(),
      level: level.trim(),
      description: description.trim(),
      userEmail: userEmail.trim().toLowerCase(),
      userName: userName.trim(),
      status: "pending",
      rejectionReason: "",
    });

    await skill.save();

    return res.status(201).json({
      message:
        "Skill added successfully! Waiting for admin approval.",
      skill,
    });
  } catch (error) {
    console.log("Add Skill Error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===================== GET MY SKILLS =====================
router.get("/my/:email", async (req, res) => {
  try {
    const email =
      req.params.email.trim().toLowerCase();

    const skills = await Skill.find({
      userEmail: email,
    }).sort({ createdAt: -1 });

    return res.status(200).json(skills);
  } catch (error) {
    console.log("Get My Skills Error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===================== GET ALL APPROVED SKILLS =====================
router.get("/all", async (req, res) => {
  try {
    const skills = await Skill.find({
      status: "approved",
    }).sort({ createdAt: -1 });

    return res.status(200).json(skills);
  } catch (error) {
    console.log(
      "Get All Skills Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===================== ADMIN - GET PENDING SKILLS =====================
router.get("/admin/pending", async (req, res) => {
  try {
    const skills = await Skill.find({
      status: "pending",
    }).sort({ createdAt: -1 });

    return res.status(200).json(skills);
  } catch (error) {
    console.log(
      "Get Pending Skills Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===================== ADMIN - APPROVE SKILL =====================
router.put(
  "/admin/approve/:id",
  async (req, res) => {
    try {
      const skill =
        await Skill.findById(req.params.id);

      if (!skill) {
        return res.status(404).json({
          message: "Skill not found",
        });
      }

      skill.status = "approved";
      skill.rejectionReason = "";

      await skill.save();

      return res.status(200).json({
        message:
          "Skill approved successfully!",
        skill,
      });
    } catch (error) {
      console.log(
        "Approve Skill Error:",
        error.message
      );

      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ===================== ADMIN - REJECT SKILL =====================
router.put(
  "/admin/reject/:id",
  async (req, res) => {
    try {
      const { rejectionReason } =
        req.body;

      if (
        !rejectionReason ||
        !rejectionReason.trim()
      ) {
        return res.status(400).json({
          message:
            "Rejection reason is required",
        });
      }

      const skill =
        await Skill.findById(req.params.id);

      if (!skill) {
        return res.status(404).json({
          message: "Skill not found",
        });
      }

      skill.status = "rejected";
      skill.rejectionReason =
        rejectionReason.trim();

      await skill.save();

      return res.status(200).json({
        message:
          "Skill rejected successfully!",
        skill,
      });
    } catch (error) {
      console.log(
        "Reject Skill Error:",
        error.message
      );

      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ===================== UPDATE SKILL =====================
router.put("/:id", async (req, res) => {
  try {
    const {
      skillName,
      category,
      level,
      description,
    } = req.body;

    if (
      !skillName ||
      !category ||
      !level ||
      !description
    ) {
      return res.status(400).json({
        message:
          "All skill fields are required",
      });
    }

    const skill =
      await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    skill.skillName =
      skillName.trim();

    skill.category =
      category.trim();

    skill.level =
      level.trim();

    skill.description =
      description.trim();

    // Updated skill should go for
    // admin approval again.
    skill.status = "pending";
    skill.rejectionReason = "";

    await skill.save();

    return res.status(200).json({
      message:
        "Skill updated successfully! Waiting for admin approval.",
      skill,
    });
  } catch (error) {
    console.log(
      "Update Skill Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===================== DELETE SKILL =====================
router.delete("/:id", async (req, res) => {
  try {
    const skill =
      await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    await Skill.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      message:
        "Skill deleted successfully!",
    });
  } catch (error) {
    console.log(
      "Delete Skill Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});


module.exports = router;