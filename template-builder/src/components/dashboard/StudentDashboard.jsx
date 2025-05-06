import React from "react";
import { useNavigate } from "react-router-dom";
import quizImage from "../../assets/quiz_img.jpeg";
import matchImage from "../../assets/match_img.png";
import sentenceImage from "../../assets/sentence_img.png";
import student_landing from "../../assets/student_landing.png";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex justify-center items-center h-screen bg-gradient-to-b from-green-300 to-green-600"
      style={{ backgroundImage: `url(${student_landing})` }}
    >
      <div className="text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            onClick={() => navigate("/mcq-template")}
            className="w-70 h-50 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={quizImage}
              alt="Quiz Builder"
              className="w-30 h-30 mb-2"
            />
            <h2 className="text-2xl font-semibold text-gray-800">Play Quiz</h2>
          </div>

          <div
            onClick={() => navigate("/match-template")}
            className="w-70 h-50 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={matchImage}
              alt="Match Builder"
              className="w-30 h-30 mb-2"
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              Find the right Match
            </h2>
          </div>

          <div
            onClick={() => navigate("/sentence-game")}
            className="w-70 h-50 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={sentenceImage}
              alt="Sentence Builder"
              className="w-30 h-30 mb-2"
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              Arrange it!
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
