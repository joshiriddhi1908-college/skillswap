import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    const userEmail = email.trim().toLowerCase();

    if (!userEmail) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }

    try {
      /* =========================================
         EXISTING BACKEND LOGIC
         MongoDB / API SAME AS BEFORE
      ========================================= */

      const response = await fetch(
        "http://localhost:5000/api/auth/check-email",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: userEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "No account found with this email."
        );

        setMessageType("error");

        return;
      }

      /* =========================================
         SAVE EMAIL FOR RESET PASSWORD
      ========================================= */

      localStorage.setItem(
        "resetEmail",
        userEmail
      );

      setMessage(
        "Email verified! You can reset your password."
      );

      setMessageType("success");

      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);

    } catch (error) {
      console.log(
        "Forgot Password Error:",
        error
      );

      setMessage(
        "Server is not connected."
      );

      setMessageType("error");
    }
  };

  return (
    <div className="forgot-page">

      {/* =========================================
          BACK TO HOME
      ========================================= */}

      <button
        type="button"
        className="forgot-back-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>


      {/* =========================================
          FORGOT PASSWORD CARD
      ========================================= */}

      <main className="forgot-container">

        {/* =======================================
            ICON
        ======================================= */}

        <div className="forgot-icon">
          🔐
        </div>


        {/* =======================================
            HEADING
        ======================================= */}

        <h1>
          Forgot Password?
        </h1>


        {/* =======================================
            DESCRIPTION
        ======================================= */}

        <p className="forgot-description">
          Don't worry! Enter your registered email
          address and we will help you reset your
          password.
        </p>


        {/* =======================================
            MESSAGE
        ======================================= */}

        {message && (
          <div
            className={`form-message ${messageType}`}
          >
            {message}
          </div>
        )}


        {/* =======================================
            FORM
        ======================================= */}

        <form onSubmit={handleReset}>

          {/* Email */}

          <div className="forgot-input-group">

            <label htmlFor="forgot-email">
              Email Address
            </label>

            <input
              id="forgot-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              required
            />

          </div>


          {/* =====================================
              RESET BUTTON
          ===================================== */}

          <button
            type="submit"
            className="reset-btn"
          >
            Send Reset Link
          </button>

        </form>


        {/* =======================================
            BACK TO LOGIN
        ======================================= */}

        <p className="back-login-text">
          Remember your password?{" "}

          <Link to="/login">
            Back to Login
          </Link>
        </p>

      </main>

    </div>
  );
}

export default ForgotPassword;