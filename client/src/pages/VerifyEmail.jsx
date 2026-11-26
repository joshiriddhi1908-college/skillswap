import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerifyEmail.css";

function VerifyEmail() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingEmail");

    if (!pendingEmail) {
      navigate("/signup", { replace: true });
      return;
    }

    setEmail(pendingEmail);
  }, [navigate]);

  // ======================================================
  // VERIFY OTP
  // ======================================================

  const handleVerify = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!otp.trim()) {
      setError("Please enter OTP");
      return;
    }

    if (otp.trim().length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otp.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "OTP verification failed");
        return;
      }

      setMessage(
        data.message || "Email verified successfully!"
      );

      localStorage.removeItem("pendingEmail");
      localStorage.removeItem("pendingUserName");

      // User is NOT logged in yet
      localStorage.removeItem("isLoggedIn");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);

    } catch (error) {
      console.error("Verify OTP Error:", error);

      setError(
        "Cannot connect to server. Please make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // RESEND OTP
  // ======================================================

  const handleResendOTP = async () => {
    setMessage("");
    setError("");

    try {
      setResending(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not resend OTP");
        return;
      }

      setMessage(
        data.message || "New OTP sent successfully!"
      );

    } catch (error) {
      console.error("Resend OTP Error:", error);

      setError(
        "Cannot connect to server. Please make sure backend is running."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-box">

        <h1>Verify Your Email</h1>

        <p className="verify-text">
          We have sent a 6-digit OTP to
        </p>

        <p className="verify-email">
          {email}
        </p>

        <form onSubmit={handleVerify}>

          <input
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
            disabled={loading}
          />

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify Email"}
          </button>
        </form>

        <button
          type="button"
          className="resend-button"
          onClick={handleResendOTP}
          disabled={resending || loading}
        >
          {resending
            ? "Sending..."
            : "Resend OTP"}
        </button>

        <p className="login-link">
          Already verified?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default VerifyEmail;