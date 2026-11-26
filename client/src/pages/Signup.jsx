import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // =========================
    // VALIDATION
    // =========================

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const cleanEmail = email.trim().toLowerCase();

      // =========================
      // SIGNUP API
      // =========================

      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName: fullName.trim(),
            email: cleanEmail,
            password: password,
          }),
        }
      );

      const responseText = await response.text();

      let data = {};

      try {
        data = JSON.parse(responseText);
      } catch {
        data = {
          message: responseText || "Unknown server response",
        };
      }

      console.log("Signup Status:", response.status);
      console.log("Signup Response:", data);

      // =========================
      // BACKEND ERROR
      // =========================

      if (!response.ok) {
        setError(
          data.message ||
            `Signup failed. Server returned ${response.status}`
        );
        return;
      }

      // ======================================================
      // AASHU TEST ACCOUNT
      // NO OTP
      // ======================================================

      if (cleanEmail === "aashu12@gmail.com") {
        setMessage(
          "Account created successfully! You can login now."
        );

        localStorage.removeItem("pendingEmail");
        localStorage.removeItem("pendingUserName");
        localStorage.removeItem("isLoggedIn");

        setTimeout(() => {
          navigate("/login", {
            replace: true,
          });
        }, 800);

        return;
      }

      // ======================================================
      // RIDDHI / NORMAL USER
      // OTP REQUIRED
      // ======================================================

      setMessage(
        data.message || "OTP has been sent to your email."
      );

      // Save pending email
      localStorage.setItem(
        "pendingEmail",
        cleanEmail
      );

      // Save pending name
      localStorage.setItem(
        "pendingUserName",
        fullName.trim()
      );

      // User is NOT logged in yet
      localStorage.removeItem("isLoggedIn");

      // ======================================================
      // GO TO VERIFY EMAIL
      // ======================================================

      setTimeout(() => {
        navigate("/verify-email", {
          replace: true,
          state: {
            email: cleanEmail,
          },
        });
      }, 800);

    } catch (error) {
      console.error("Signup Error:", error);

      setError(
        "Cannot connect to server. Please make sure backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">

        <h1>Create Account</h1>

        <form onSubmit={handleSignup}>

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            disabled={loading}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            disabled={loading}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            disabled={loading}
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            disabled={loading}
          />

          {/* Error Message */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {/* Success Message */}
          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Sign Up"}
          </button>

        </form>

        <p>
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;