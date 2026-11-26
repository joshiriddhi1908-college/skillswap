const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/User");

const router = express.Router();

// ======================================================
// EMAIL CONFIGURATION
// ======================================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },
});

// ======================================================
// GENERATE 6 DIGIT OTP
// ======================================================

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ======================================================
// SEND OTP EMAIL
// ======================================================

const sendOTPEmail = async (email, otp, fullName) => {
  await transporter.sendMail({
    from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "SkillSwap Email Verification OTP",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: auto;
        padding: 30px;
        border-radius: 12px;
        background: #24203b;
        color: white;
      ">
        <h2 style="color: #a855f7;">
          Welcome to SkillSwap!
        </h2>

        <p>Hello ${fullName},</p>

        <p>
          Thank you for creating your SkillSwap account.
          Use the OTP below to verify your email address.
        </p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          text-align: center;
          padding: 20px;
          margin: 20px 0;
          background: #15111f;
          border-radius: 10px;
          color: #a855f7;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for <strong>5 minutes</strong>.
        </p>

        <p>
          If you did not create this account, you can ignore this email.
        </p>

        <p style="margin-top: 30px;">
          Regards,<br/>
          <strong>SkillSwap Team</strong>
        </p>
      </div>
    `,
  });
};

// ======================================================
// SIGNUP
// ======================================================

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.findOne({
      email: cleanEmail,
    });

    // ==================================================
    // AASHU TEST USER
    // NO OTP
    // ==================================================

    if (cleanEmail === "aashu12@gmail.com") {
      if (user) {
        user.fullName = fullName.trim();
        user.password = hashedPassword;
        user.isVerified = true;
        user.otp = "";
        user.otpExpires = null;

        // Keep existing role if already present
        if (!user.role) {
          user.role = "user";
        }
      } else {
        user = new User({
          fullName: fullName.trim(),
          email: cleanEmail,
          password: hashedPassword,

          // Default normal user
          role: "user",

          isVerified: true,
          otp: "",
          otpExpires: null,
        });
      }

      await user.save();

      return res.status(201).json({
        message: "Account created successfully. You can login now.",
        email: cleanEmail,

        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role || "user",
        },
      });
    }

    // ==================================================
    // NORMAL USER
    // OTP REQUIRED
    // ==================================================

    const otp = generateOTP();

    const otpExpires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // ==================================================
    // EXISTING USER
    // RESET OTP AND SEND AGAIN
    // ==================================================

    if (user) {
      user.fullName = fullName.trim();
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpires = otpExpires;

      // Important:
      // Signup again starts a fresh OTP verification.
      user.isVerified = false;

      // Never change an existing admin role here.
      if (!user.role) {
        user.role = "user";
      }

      await user.save();
    }

    // ==================================================
    // NEW USER
    // ==================================================

    else {
      user = new User({
        fullName: fullName.trim(),
        email: cleanEmail,
        password: hashedPassword,

        // Every new signup is a normal user.
        // Admin role will be assigned separately.
        role: "user",

        isVerified: false,
        otp: otp,
        otpExpires: otpExpires,
      });

      await user.save();
    }

    // ==================================================
    // SEND OTP
    // ==================================================

    await sendOTPEmail(
      cleanEmail,
      otp,
      fullName.trim()
    );

    return res.status(201).json({
      message: "Account created. OTP sent to your email.",
      email: cleanEmail,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || "user",
      },
    });

  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
});

// ======================================================
// VERIFY OTP
// ======================================================

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ==================================================
    // AASHU DOES NOT NEED OTP
    // ==================================================

    if (cleanEmail === "aashu12@gmail.com") {
      user.isVerified = true;
      user.otp = "";
      user.otpExpires = null;

      if (!user.role) {
        user.role = "user";
      }

      await user.save();

      return res.status(200).json({
        message: "Email verification skipped for this test account.",

        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role || "user",
        },
      });
    }

    // ==================================================
    // CHECK OTP
    // ==================================================

    if (user.otp !== otp.toString().trim()) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // ==================================================
    // CHECK EXPIRY
    // ==================================================

    if (
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // ==================================================
    // VERIFY USER
    // ==================================================

    user.isVerified = true;
    user.otp = "";
    user.otpExpires = null;

    if (!user.role) {
      user.role = "user";
    }

    await user.save();

    return res.status(200).json({
      message: "Email verified successfully!",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || "user",
      },
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
});

// ======================================================
// RESEND OTP
// ======================================================

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // ==================================================
    // AASHU DOES NOT NEED OTP
    // ==================================================

    if (cleanEmail === "aashu12@gmail.com") {
      return res.status(200).json({
        message: "This test account does not require OTP.",
      });
    }

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please signup first.",
      });
    }

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    user.isVerified = false;

    if (!user.role) {
      user.role = "user";
    }

    await user.save();

    await sendOTPEmail(
      cleanEmail,
      otp,
      user.fullName
    );

    return res.status(200).json({
      message: "New OTP sent successfully!",
    });

  } catch (error) {
    console.error("Resend OTP Error:", error);

    return res.status(500).json({
      message: "Could not send OTP",
      error: error.message,
    });
  }
});

// ======================================================
// LOGIN
// ======================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please signup first.",
      });
    }

    // ==================================================
    // CHECK BANNED USER
    // ==================================================

   // ==================================================
// CHECK BANNED USER
// ==================================================

if (user.isBanned) {
  return res.status(403).json({
    message: "Your account is banned by admin.",
  });
}

    // ==================================================
    // CHECK EMAIL VERIFICATION
    // ==================================================

    if (user.isVerified !== true) {
      return res.status(403).json({
        message:
          "Please verify your email with OTP before login.",
        needsVerification: true,
        email: user.email,
      });
    }

    // ==================================================
    // CHECK PASSWORD
    // ==================================================

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ==================================================
    // DEFAULT ROLE FOR OLD USERS
    // ==================================================

    if (!user.role) {
      user.role = "user";
      await user.save();
    }

    // ==================================================
    // LOGIN SUCCESS
    // ==================================================

    return res.status(200).json({
      message: "Login successful",

      user: {
        id: user._id,

        fullName: user.fullName,
        email: user.email,

        // IMPORTANT:
        // This is used by frontend to identify
        // normal user or admin.
        role: user.role,

        location: user.location,
        profileVisibility: user.profileVisibility,
        availability: user.availability,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        profilePhoto: user.profilePhoto,

        isVerified: user.isVerified,
        isBanned: user.isBanned,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// ======================================================
// UPDATE PROFILE
// ======================================================

router.put("/profile", async (req, res) => {
  try {
    const {
      email,
      fullName,
      location,
      profileVisibility,
      availability,
      skillsOffered,
      skillsWanted,
      profilePhoto,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (fullName !== undefined) {
      user.fullName = fullName;
    }

    if (location !== undefined) {
      user.location = location;
    }

    if (profileVisibility !== undefined) {
      user.profileVisibility = profileVisibility;
    }

    if (availability !== undefined) {
      user.availability = availability;
    }

    if (skillsOffered !== undefined) {
      user.skillsOffered = skillsOffered;
    }

    if (skillsWanted !== undefined) {
      user.skillsWanted = skillsWanted;
    }

    if (profilePhoto !== undefined) {
      user.profilePhoto = profilePhoto;
    }

    // IMPORTANT:
    // Role is NOT accepted from req.body.
    // This prevents profile update from changing
    // user -> admin from frontend.

    if (!user.role) {
      user.role = "user";
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,

        location: user.location,
        profileVisibility: user.profileVisibility,
        availability: user.availability,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        profilePhoto: user.profilePhoto,

        isVerified: user.isVerified,
        isBanned: user.isBanned,
      },
    });

  } catch (error) {
    console.error("Profile Update Error:", error);

    return res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
});

// ======================================================
// FORGOT PASSWORD
// ======================================================

router.put("/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "Email not registered",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      message: "Password reset failed",
      error: error.message,
    });
  }
});

// ======================================================
// CHECK EMAIL
// ======================================================

router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "Email not registered",
        exists: false,
      });
    }

    return res.status(200).json({
      message: "Email exists",
      exists: true,
    });

  } catch (error) {
    console.error("Check Email Error:", error);

    return res.status(500).json({
      message: "Could not check email",
    });
  }
});

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;