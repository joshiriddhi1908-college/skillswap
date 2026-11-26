const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    // Original request
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: false,
    },

    // Skill
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

    // Person giving rating
    reviewerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    reviewerName: {
      type: String,
      required: true,
      trim: true,
    },

    // Skill teacher
    teacherEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    teacherName: {
      type: String,
      required: true,
      trim: true,
    },

    // Rating
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Feedback
    feedback: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Rating",
  ratingSchema
);