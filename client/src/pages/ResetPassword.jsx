import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ResetPassword.css";
function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!password || !confirmPassword) {
      setMessage(
        "Please fill in both password fields."
      );
      setMessageType("error");
      return;
    }

    if (password.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        "Passwords do not match."
      );
      setMessageType("error");
      return;
    }

    // Get email from Forgot Password page
    const email =
      localStorage.getItem("resetEmail");

    if (!email) {
      setMessage(
        "Please start the password reset process again."
      );
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
          "Password reset failed."
        );
        setMessageType("error");
        return;
      }

      setMessage(
        "Password reset successfully!"
      );
      setMessageType("success");

      // Remove temporary reset email
      localStorage.removeItem("resetEmail");

      setPassword("");
      setConfirmPassword("");

      // Go to login after 1.5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.log(
        "Reset Password Error:",
        error
      );

      setMessage(
        "Server is not connected."
      );
      setMessageType("error");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-box">

        <div className="auth-icon">
          🔐
        </div>

        <h1>Reset Password</h1>

        <p className="auth-subtitle">
          Create a new password for your
          Skill Swap account.
        </p>

        <form onSubmit={handleSubmit}>

          <label>New Password</label>

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <button type="submit">
            Reset Password
          </button>

        </form>

        {message && (
          <p
            className={
              messageType === "success"
                ? "success-message"
                : "error-message"
            }
          >
            {message}
          </p>
        )}

        <Link
          to="/login"
          className="back-login"
        >
          ← Back to Login
        </Link>

      </div>

    </div>
  );
}

export default ResetPassword;