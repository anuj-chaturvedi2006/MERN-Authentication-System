import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    address: "",
  });

  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");

  const [load, setLoad] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // Send OTP
  const getEmail = async () => {
    try {
      if (!form.email.trim()) {
        toast.warning("Please enter email");
        return;
      }

      const res = await axios.post(
        "http://localhost:2002/get-email",
        {
          email: form.email,
        }
      );

      console.log(res.data);

      setLoad(true);

      toast.success("OTP sent successfully!");
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Failed to send OTP"
      );
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const enteredOtp = otp1 + otp2 + otp3 + otp4;

    if (enteredOtp.length !== 4) {
      toast.warning("Please enter complete OTP");
      return;
    }

    try {
      const compare = await axios.post(
        "http://localhost:2002/verify-otp",
        {
          email: form.email,
          otp: enteredOtp,
        }
      );

      console.log("Entered OTP:", enteredOtp);
      console.log("Backend response:", compare.data);

      if (compare.data.success) {
        setOtpVerified(true);
        setLoad(false);

        toast.success("OTP verified successfully!");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    }
  };

  // Signup
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      toast.warning("Please verify your email first");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:2002/signup",
        form
      );

      console.log(res.data);
      console.log(form);

      localStorage.setItem(
        "form",
        JSON.stringify(form)
      );

      toast.success("Signup successful!");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <>
      <div className="container">
        <div className="form-box">

          {/* Header */}
          <div className="header">
            <div className="profile-icon">
              👤
            </div>

            <h2>Create Account</h2>

            <p>
              Sign up to create your account
            </p>
          </div>

          <form onSubmit={submitHandler}>

            {/* Name */}
            <div className="form-group">
              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={changeHandler}
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>
                Email Address
              </label>

              <div className="email-row">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={changeHandler}
                  placeholder="Enter your email"
                />

                {form.email.trim() !== "" && (
                  <button
                    type="button"
                    className="verify-btn"
                    onClick={getEmail}
                    disabled={otpVerified}
                  >
                    {otpVerified
                      ? "Verified ✓"
                      : "Verify"}
                  </button>
                )}
              </div>
            </div>

            {/* OTP */}
            {load && !otpVerified && (
              <div className="otp-section">

                <div className="otp-heading">
                  <h3>
                    Verify Your Email
                  </h3>

                  <p>
                    Enter the 4-digit OTP sent to your email
                  </p>
                </div>

                <div className="otp-box">

                  <input
                    type="text"
                    maxLength="1"
                    value={otp1}
                    onChange={(e) =>
                      setOtp1(e.target.value)
                    }
                  />

                  <input
                    type="text"
                    maxLength="1"
                    value={otp2}
                    onChange={(e) =>
                      setOtp2(e.target.value)
                    }
                  />

                  <input
                    type="text"
                    maxLength="1"
                    value={otp3}
                    onChange={(e) =>
                      setOtp3(e.target.value)
                    }
                  />

                  <input
                    type="text"
                    maxLength="1"
                    value={otp4}
                    onChange={(e) =>
                      setOtp4(e.target.value)
                    }
                  />
                </div>

                <button
                  type="button"
                  className="confirm-otp-btn"
                  onClick={verifyOtp}
                >
                  Confirm OTP
                </button>

              </div>
            )}

            {/* Verified */}
            {otpVerified && (
              <div className="verified-box">

                <div className="verified-icon">
                  ✓
                </div>

                <div>
                  <p className="verified-title">
                    Email Verified
                  </p>

                  <p className="verified-text">
                    Your email has been successfully verified.
                  </p>
                </div>

              </div>
            )}

            {/* Password */}
            <div className="form-group">
              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={changeHandler}
                placeholder="Enter your password"
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label>
                Gender
              </label>

              <div className="gender-box">

                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={changeHandler}
                  />

                  <span>
                    Male
                  </span>
                </label>

                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={changeHandler}
                  />

                  <span>
                    Female
                  </span>
                </label>

                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    onChange={changeHandler}
                  />

                  <span>
                    Other
                  </span>
                </label>

              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label>
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={changeHandler}
                placeholder="Enter your address"
                rows="3"
              />
            </div>

            {/* Signup */}
            <button
              type="submit"
              className="signup-btn"
            >
              Create Account
            </button>

          </form>

          {/* Footer */}
          <p className="login-text">
            Already have an account?

            <span onClick={handleLogin}>
              Login
            </span>
          </p>

        </div>
      </div>

      {/* React Toastify */}
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

export default App;