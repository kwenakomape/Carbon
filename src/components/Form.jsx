
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import axios from 'axios';
import {
  Icon,
  
  Form,
} from "semantic-ui-react";


export const LandingForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cell, setCell] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/check-username",
        { username }
      );
      const { exists, type, Cell, erroMessage } = response.data;

      if (type === "email" && exists) {
        setShowPasswordField(true);
        setShowOTPField(false);
        setErrorMessage("");
      } else if (type === "id" && exists) {
        setShowOTPField(true);
        setShowPasswordField(false);
        setErrorMessage("");
        setCell(Cell);
        await axios.post("http://localhost:3001/send-otp", { Cell });
      } else {
        setErrorMessage(erroMessage);
      }
    } catch (error) {
      setErrorMessage("An error occurred while checking the username");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (showPasswordField) {
      try {
        const response = await axios.post(
          "http://localhost:3001/verify-password",
          { username, password }
        );

        if (response.data.valid) {
          console.log("this is the is", response.data.AdminID);
          navigate(`/dashboard/admin/${response.data.AdminID}`);
        } else {
          setErrorMessage(response.data.errorMessage);
        }
      } catch (error) {
        console.error("Error verifying password:", error);
        setErrorMessage("An error occurred while verifying the password");
      }
    } else if (showOTPField) {
      try {
        const response = await axios.post("http://localhost:3001/verify-otp", {
          Cell: cell,
          otp,
        });
        if (response.data.valid) {
          navigate(`/dashboard/user/${username}`);
        } else {
          setErrorMessage("Invalid OTP");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setErrorMessage("Invalid OTP");
        } else {
          setErrorMessage("An error occurred while verifying the OTP");
        }
      }
    }
  };

  return (
   
  <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
    <div className="w-full">
      <div className="text-center">
        {showPasswordField || showOTPField ? (
          <h1 className="text-3xl font-semibold text-gray-900">Log In</h1>
        ) : (
          <h1 className="text-3xl font-semibold text-gray-900">Enter Username</h1>
        )}
      </div>
      <div className="mt-5">
        <Form onSubmit={handleSubmit}>
          <div className="relative mt-6">
            <input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              readOnly={showPasswordField || showOTPField}
              className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
            />
            <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">
              Username
            </label>
          </div>
          {errorMessage && (
            <div className="username-error-alert mt-2 text-red-600">
              <span>
                <Icon
                  name="exclamation triangle"
                  size="Small"
                  className="blinking-icon"
                />
                <strong>Error:</strong> {errorMessage}
              </span>
            </div>
          )}
          {!showPasswordField && !showOTPField && (
            <>
              <button
                type="submit"
                className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none mt-6"
              >
                Next
              </button>
              <br />
              <br />
              <p className="text-center text-sm text-gray-500">
                or{" "}
                <a
                  href="/create-account"
                  className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none"
                >
                  Create New Account
                </a>
              </p>
            </>
          )}
          {(showPasswordField || showOTPField) && (
            <>
              {showPasswordField && (
                <div className="relative mt-6">
                  <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                  />
                  <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">
                    Password
                  </label>
                </div>
              )}
              {showOTPField && (
                <div className="relative mt-6">
                  <input
                    type="text"
                    placeholder="OTP"
                    onChange={(e) => setOtp(e.target.value)}
                    className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                  />
                  <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">
                    OTP
                  </label>
                </div>
              )}
              <button
                type="submit"
                onClick={handleLoginSubmit}
                className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none mt-6"
              >
                LOGIN
              </button>
            </>
          )}
        </Form>
      </div>
    </div>
  </div>
  );
};