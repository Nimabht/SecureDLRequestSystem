import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleSVG from "../assets/GoogleSVG";
import LoginPersonsSVG from "../assets/LoginPersonsSVG";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");

  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPass) {
      toast.error("All fields are required.");
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
      toast.error(
        "Password must be at least 8 characters long and include at least one letter and one number.",
      );
      return false;
    }

    if (password !== confirmPass) {
      toast.error("Password and Confirm Password must match.");
      return false;
    }

    return true;
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let response: any = await axios.post<{
        username: string;
        email: symbol;
        googleId: any;
        userId: number;
      }>(`${import.meta.env.VITE_BACKEND_URL}/v1/auth/signup`, {
        email,
        password,
        username,
      });

      response = await axios.post<{ access_token: string }>(
        `${import.meta.env.VITE_BACKEND_URL}/v1/auth/login`,
        { password, username },
      );

      localStorage.setItem("jwtToken", response.data.access_token);
      toast.success("Signup successful!");

      setTimeout(() => {
        navigate("/requests");
      }, 1500);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const tryGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/v1/auth/google`;
  };

  return (
    <div className="flex h-screen">
      <ToastContainer />
      {/* Left Pane */}
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
        <div className="max-w-md text-center">
          <LoginPersonsSVG />
        </div>
      </div>

      {/* Right Pane */}
      <form
        onSubmit={handleSignup}
        className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center"
      >
        <div className="max-w-md w-full p-6">
          <h1 className="text-3xl font-semibold mb-6 text-black text-center">
            Sign Up
          </h1>
          <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
            Join Our Community with all-time access to our DL
          </h1>
          <div className="mt-4 flex  flex-col lg:flex-row items-center justify-center">
            <div className="w-full lg:w-1/2 mb-2 lg:mb-0">
              <button
                onClick={tryGoogleAuth}
                type="button"
                className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
              >
                <GoogleSVG /> Sign Up with Google
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>or with email</p>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-black hover:underline">
                Login here
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
