import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { FaArrowRight } from "react-icons/fa";

interface Request {
  id: number;
  userId: string;
  prompt: string;
  result: string;
  status: string;
  createdAt: string;
}

const Requests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const response = await axios.get<Request[]>(
          `${import.meta.env.VITE_BACKEND_URL}/v1/requests/user-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <>
      <NavBar />
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="grid grid-cols-2 gap-6">
          {requests.map((request) => {
            const statusColor =
              request.status === "completed"
                ? "text-green-500"
                : request.status === "processing"
                ? "text-yellow-500"
                : "text-gray-400";
            return (
              <div
                key={request.id}
                className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {request.prompt}
                  </h3>
                  <p className="text-sm text-gray-600 mb-7">
                    Result:{" "}
                    {request.result ? request.result : "No result available"}
                  </p>
                  <p className={`text-smmt-1 ${statusColor}`}>
                    Status: {request.status}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created At:{" "}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Requests;
