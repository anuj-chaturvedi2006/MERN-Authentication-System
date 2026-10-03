import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const Login = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);


  const changeHandler = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

  };


  const loginHandler = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:2002/login",
        form
      );

      console.log(res.data);

      // Success Toast
      toast.success(
        res?.data?.message || "Login successful!"
      );

      // Email localStorage me save
      localStorage.setItem(
        "email",
        JSON.stringify(form.email)
      );

    } catch (error) {

      console.log(error);

      // Error Toast
      toast.error(
        error?.response?.data?.message ||
        "Login failed. Please try again."
      );

    }

  };


  const forgetPassword = () => {

    navigate("/forget");

  };


  const resetPassword = () => {

    if (form.email.trim() === "") {

      toast.error(
        "Please enter your email first!"
      );

      return;
    }

    // Email save
    localStorage.setItem(
      "email",
      JSON.stringify(form.email)
    );

    navigate("/reset");

  };


  return (
    <>

      <div className="login-container">

        <div className="login-box">


          {/* Header */}

          <div className="login-header">

            <div className="login-icon">
              🔐
            </div>

            <h2>Welcome Back</h2>

            <p>
              Login to your account
            </p>

          </div>


          <form onSubmit={loginHandler}>


            {/* Email */}

            <div className="login-form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={changeHandler}
                placeholder="Enter your email"
                required
              />

            </div>


            {/* Password */}

            <div className="login-form-group">

              <label>
                Password
              </label>

              <div className="password-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={changeHandler}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>


            {/* Forgot Password */}

            <div className="forgot-box">

              <button
                type="button"
                onClick={forgetPassword}
              >
                Forgot Password?
              </button>

            </div>


            {/* Login */}

            <button
              type="submit"
              className="login-btn"
            >
              Login
            </button>


            {/* Reset Password */}

            <button
              type="button"
              onClick={resetPassword}
              className="reset-btn"
            >
              Reset Password
            </button>

          </form>


          {/* Footer */}

          <p className="signup-text">

            Don't have an account?

            <span
              onClick={() =>
                navigate("/signup")
              }
            >
              Sign Up
            </span>

          </p>


        </div>

      </div>


      {/* Toastify */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

    </>
  );
};

export default Login;

