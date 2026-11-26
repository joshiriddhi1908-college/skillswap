const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    type: {
      type: String,
      default: "rating",
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    reviewerName: {
      type: String,
      default: "",
    },

    skillName: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);