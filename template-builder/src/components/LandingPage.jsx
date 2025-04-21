import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import homePage from "../assets/homePage.png";
import teacherImage from "../assets/teacher.png";
import studentImage from "../assets/student.png";

const LandingPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (role) => {
    localStorage.setItem("userRole", role); // Store role in localStorage
    console.log(role);
    await login(role); // Ensure authentication is completed
    navigate(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
  };

  return (
    <div
      className="min-h-screen bg-green-100 flex flex-col items-center justify-center text-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${homePage})` }}
    >
      {/* <h1 className="text-5xl font-bold text-blue-700 drop-shadow-md">
        EduQuest
      </h1> */}

      {/* Buttons with Images */}
      <div className="mt-6 flex gap-8">
        <button
          className="flex flex-col items-center px-6 py-3 bg-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-red-600 transition duration-300"
          onClick={() => handleLogin("teacher")}
        >
          <img
            src={teacherImage}
            alt="Teacher"
            className="w-70 h-70 mb-2"
          />
          Teacher
        </button>

        {/* Student Button */}
        <button
          className="flex flex-col items-center px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-red-600 transition duration-300"
          onClick={() => handleLogin("student")}
        >
          <img
                   src={studentImage}
            alt="Student"
            className="w-70 h-70 mb-2"
          />
          Student
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
