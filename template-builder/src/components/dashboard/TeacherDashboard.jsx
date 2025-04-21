import React from "react";
import { useNavigate } from "react-router-dom";
import teacher_landing from "../../assets/teacher_landing.png";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex justify-center items-center h-screen bg-gradient-to-b from-green-300 to-green-600"
      style={{ backgroundImage: `url(${teacher_landing})` }}
    >
      <div className="text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* MCQ Card */}
          <div
            onClick={() => navigate("/mcqform")}
            className="w-64 h-64 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform p-4"
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              Quiz Template
            </h2>
            <p className="text-gray-600 mt-2">
              Create multiple-choice questions
            </p>
          </div>

          {/* Match Template */}
          <div
            onClick={() => navigate("/matchform")}
            className="w-64 h-64 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform p-4"
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              Match Template
            </h2>
            <p className="text-gray-600 mt-2">Create matching exercises</p>
          </div>

          {/* Sentence Template Card */}
          <div
            onClick={() => navigate("/sentence-template")}
            className="w-64 h-64 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform p-4"
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              Sentence Template
            </h2>
            <p className="text-gray-600 mt-2">
              Create image based sentence builder
            </p>
          </div>

          {/* Add Images */}
          <div
            onClick={() => navigate("/add-images")}
            className="w-64 h-64 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform p-4"
          >
            <h2 className="text-2xl font-semibold text-gray-800">Add Images</h2>
            <p className="text-gray-600 mt-2">Add your own images</p>
          </div>

    
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
