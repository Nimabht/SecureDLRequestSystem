import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const NavBar: React.FC = () => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [prompt, setPrompt] = useState("");

  const signoutUser = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  };

  const handleNewClick = () => {
    setShowTextArea(!showTextArea);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/v1/requests/submit-request`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Request submitted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Delay to show toast before reloading
    } catch (error) {
      toast.error("Failed to submit request.");
    }
  };

  return (
    <>
      <ToastContainer />
      <nav className="flex justify-between px-20 py-4 items-center bg-white shadow">
        <div className="flex justify-center items-center gap-3">
          <img
            className="rounded-full w-10"
            src="./c4ears-logo.png"
            alt="c4ears logo"
          />
          <h1 className="text-xl text-gray-800 font-bold">C4Ears Dashboard</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={signoutUser}
              className="flex justify-center items-center gap-3 w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
            >
              <IoLogOutOutline />
              <span>Signout</span>
            </button>
            <button
              onClick={handleNewClick}
              className="flex justify-center items-center gap-3 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              <FaPlus />
              <span>New</span>
            </button>
          </div>
        </div>
      </nav>

      {showTextArea && (
        <div className="bg-gray-100 p-6 shadow-lg">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="w-full h-24 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-500 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
            >
              Submit
            </button>
            <button
              onClick={() => setShowTextArea(false)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-500 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
