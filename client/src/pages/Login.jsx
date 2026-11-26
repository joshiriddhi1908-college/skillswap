import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  // ======================================================
  // LOGIN
  // ======================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    const userEmail = email.trim().toLowerCase();


    if (!userEmail) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }


    if (!password) {
      setMessage("Please enter your password.");
      setMessageType("error");
      return;
    }


    try {
      setLoading(true);


      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: userEmail,
            password: password,
          }),
        }
      );


      const data = await response.json();



      // ==================================================
      // LOGIN ERROR
      // ==================================================

      if (!response.ok) {


        if (data.needsVerification === true) {

          localStorage.setItem(
            "pendingEmail",
            data.email || userEmail
          );


          setMessage(
            "Please verify your email first. OTP verification is required."
          );

          setMessageType("error");


          setTimeout(() => {
            navigate("/verify-email");
          }, 1200);


          return;
        }


        setMessage(
          data.message || "Login failed"
        );

        setMessageType("error");

        return;
      }



      // ==================================================
      // LOGIN SUCCESS
      // ==================================================


      localStorage.setItem(
        "isLoggedIn",
        "true"
      );


      localStorage.setItem(
        "userName",
        data.user.fullName
      );


      localStorage.setItem(
        "userEmail",
        data.user.email
      );


      // ==================================================
      // SAVE USER WITH ROLE
      // ==================================================

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data.user,
          role: data.user.role || "user",
        })
      );



      localStorage.removeItem(
        "pendingEmail"
      );

      localStorage.removeItem(
        "pendingUserName"
      );



      setMessage(
        "Login successful!"
      );

      setMessageType(
        "success"
      );



      setTimeout(() => {

        navigate("/dashboard");

      }, 800);



    } catch (error) {


      console.error(
        "Login Error:",
        error
      );


      setMessage(
        "Server is not connected. Please make sure backend is running."
      );


      setMessageType(
        "error"
      );


    } finally {

      setLoading(false);

    }

  };



  // ======================================================
  // UI
  // ======================================================


  return (

    <div className="login-page">


      <div className="login-box">


        <h2>
          Welcome Back
        </h2>


        <p className="login-subtitle">
          Login to your Skill Swap account
        </p>



        {message && (

          <div className={`form-message ${messageType}`}>

            {message}

          </div>

        )}




        <form
          onSubmit={handleLogin}
          autoComplete="off"
        >



          <div className="input-group">


            <input

              type="email"

              placeholder="Email"

              value={email}

              onChange={(e)=>
                setEmail(e.target.value)
              }

              autoComplete="off"

              disabled={loading}

              required

            />


          </div>




          <div className="input-group">


            <div className="password-wrapper">


              <input

                type={
                  showPassword
                  ? "text"
                  : "password"
                }

                placeholder="Password"

                value={password}

                onChange={(e)=>
                  setPassword(e.target.value)
                }

                autoComplete="new-password"

                disabled={loading}

                required

              />



              <button

                type="button"

                className="show-password"

                onClick={() =>
                  setShowPassword(!showPassword)
                }

              >

                {showPassword ? "🙈" : "👁️"}

              </button>


            </div>


          </div>





          <div className="login-options">


            <label className="remember-me">


              <input

                type="checkbox"

                disabled={loading}

              />


              Remember me


            </label>



            <Link to="/forgot-password">

              Forgot Password?

            </Link>


          </div>





          <button

            type="submit"

            className="login-btn"

            disabled={loading}

          >

            {
              loading
              ? "Logging in..."
              : "Login"
            }

          </button>




        </form>





        <p className="signup-text">


          Don't have an account?{" "}



          <Link to="/signup">

            Sign Up

          </Link>



        </p>




      </div>


    </div>

  );

}


export default Login;