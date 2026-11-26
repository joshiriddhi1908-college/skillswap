const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ===================== BASIC INFO =====================

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ===================== EMAIL VERIFICATION =====================

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: "",
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    // ===================== PROFILE =====================

    location: {
      type: String,
      default: "",
      trim: true,
    },

    profileVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    availability: {
      type: [String],
      default: [],
    },

    skillsOffered: {
      type: [String],
      default: [],
    },

    skillsWanted: {
      type: [String],
      default: [],
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    // ===================== USER ROLE =====================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ===================== ADMIN =====================

    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);