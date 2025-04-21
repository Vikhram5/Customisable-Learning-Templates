import React, { useState } from "react";
import ImageSelector from "../ImageSelector";

const apiBaseUrl = import.meta.env.VITE_BASE_URL; 

const MatchTemplate = () => {
  const [numQuestions, setNumQuestions] = useState(3);
  const [questions, setQuestions] = useState(
    Array.from({ length: 3 }, () => ({ image: "", name: "" }))
  );

  const handleNumQuestionsChange = (e) => {
    const newNumQuestions = Math.max(3, parseInt(e.target.value));
    setNumQuestions(newNumQuestions);

    const updatedQuestions = [...questions];
    while (updatedQuestions.length < newNumQuestions) {
      updatedQuestions.push({ image: "", name: "" });
    }
    while (updatedQuestions.length > newNumQuestions) {
      updatedQuestions.pop();
    }
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleDrop = (index, event) => {
    event.preventDefault();
    const imageName = event.dataTransfer.getData("text/plain");
    handleQuestionChange(index, "image", imageName);
  };

  const removeImage = (index) => {
    handleQuestionChange(index, "image", "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jsonData = { questions };

    try {
      const response = await fetch(`${apiBaseUrl}/match-save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        console.log("Data saved successfully");
      } else {
        console.log("Error saving data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-xl border border-gray-200">

      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Match Template</h1>
        <p className="text-gray-600 mt-2 text-lg">Customize your game questions below!</p>
      </div>


      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Number of Questions */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-300">
          <label className="block text-xl font-medium text-gray-700">Number of Questions</label>
          <input
            type="number"
            value={numQuestions}
            min="3"
            onChange={handleNumQuestionsChange}
            className="mt-3 p-3 border rounded-md w-full text-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Questions List */}
        {questions.map((question, index) => (
          <div key={index} className="bg-gray-50 shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">Question {index + 1}</h2>

            <div className="flex items-center gap-6 mt-4">
              {/* Image Drop Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(index, e)}
                className="border-4 border-dashed border-gray-400 rounded-lg p-6 flex justify-center items-center min-h-[140px] w-[180px] bg-white hover:bg-gray-100 cursor-pointer transition-all relative shadow-sm"
              >
                {question.image ? (
                  <div className="relative">
                    <img
                      src={`/symbols/${question.image}`}
                      alt="Selected"
                      width={140}
                      height={140}
                      className="rounded-lg shadow-md border border-gray-300"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      type="button"
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs p-2 rounded-full shadow-md hover:bg-red-700 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Drag & Drop Image Here</p>
                )}
              </div>

              {/* Text Input field */}
              <div className="flex-1">
                <label className="block text-lg font-medium text-gray-700">Image Label</label>
                <input
                  type="text"
                  value={question.name}
                  onChange={(e) => handleQuestionChange(index, "name", e.target.value)}
                  className="mt-3 p-3 border rounded-md w-full text-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter the image name"
                />
              </div>
            </div>
          </div>
        ))}


        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 text-xl font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          ✅ Save Game Setup
        </button>
      </form>
      <ImageSelector /> {/* to fetch images */}
    </div>
  );
};

export default MatchTemplate;