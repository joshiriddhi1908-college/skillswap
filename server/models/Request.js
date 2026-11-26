const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    skillName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      required: true,
      trim: true,
    },

    teacherEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    teacherName: {
      type: String,
      required: true,
      trim: true,
    },

    requesterEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    requesterName: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Request", requestSchema);