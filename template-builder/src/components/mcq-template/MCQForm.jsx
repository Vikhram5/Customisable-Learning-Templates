import React, { useState } from "react";
import ImageSelector from "../ImageSelector";
const apiBaseUrl = import.meta.env.VITE_BASE_URL;
console.log(apiBaseUrl)

const MCQForm = () => {
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([
    { question: "", image: "", options: ["", ""], answer: "", numOptions: 2 },
  ]);

  const handleNumQuestionsChange = (e) => {
    const newNumQuestions = parseInt(e.target.value);
    setNumQuestions(newNumQuestions);

    const updatedQuestions = [...questions];
    while (updatedQuestions.length < newNumQuestions) {
      updatedQuestions.push({
        question: "",
        image: "",
        options: ["", ""],
        answer: "",
        numOptions: 2,
      });
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

  const handleNumOptionsChange = (index, value) => {
    const updatedQuestions = [...questions];
    const numOptions = Math.max(2, Math.min(4, parseInt(value)));
    updatedQuestions[index].numOptions = numOptions;

    while (updatedQuestions[index].options.length < numOptions) {
      updatedQuestions[index].options.push("");
    }
    while (updatedQuestions[index].options.length > numOptions) {
      updatedQuestions[index].options.pop();
    }

    setQuestions(updatedQuestions);
  };

  const handleDrop = (index, event) => {
    event.preventDefault();
    const imageName = event.dataTransfer.getData("text/plain");
    handleQuestionChange(index, "image", imageName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check
    for (const question of questions) {
      if (!question.question.trim()) {
        alert("Each question must be filled.");
        return;
      }
      if (!question.image) {
        alert("Each question must have an image.");
        return;
      }
      if (question.options.some((option) => !option.trim())) {
        alert("All options must be filled.");
        return;
      }
      if (!question.answer.trim()) {
        alert("You must select a correct answer.");
        return;
      }
    }

    // If all validations pass, submit data
    const jsonData = { questions };

    try {
      const response = await fetch(`${apiBaseUrl}/save-json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        alert("Data saved successfully!");
      } else {
        alert("Error saving data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-red-100 min-h-screen flex flex-col lg:flex-row space-y-8 lg:space-y-0">
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Number of Questions Input */}
          <div className="bg-white p-4 shadow-md rounded-lg">
            <label className="block text-lg font-semibold">
              Enter the number of Questions
            </label>
            <input
              type="number"
              value={numQuestions}
              min="1"
              onChange={handleNumQuestionsChange}
              className="mt-2 p-3 border rounded-lg w-1/4 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <h2 className="text-xl font-semibold mb-4">
                Question {index + 1}
              </h2>

              {/* Question Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Enter Question
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) =>
                    handleQuestionChange(index, "question", e.target.value)
                  }
                  className="mt-2 p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                  placeholder="Type your question here..."
                />
              </div>

              {/* Image Drop Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(index, e)}
                className="border-2 border-dashed p-6 flex flex-col justify-center items-center min-h-[140px] md:min-h-[180px] lg:min-h-[200px] mb-4 relative"
              >
                {question.image ? (
                  <>
                    <img
                      src={`/symbols/${question.image}`}
                      alt="Selected"
                      className="w-30 h-30 object-cover rounded-md mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuestionChange(index, "image", "")}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Remove Image
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500">Drag & Drop Image Here</p>
                )}
              </div>

              {/* Number of Options */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Number of Options
                </label>
                <input
                  type="number"
                  min="2"
                  max="4"
                  value={question.numOptions}
                  onChange={(e) =>
                    handleNumOptionsChange(index, e.target.value)
                  }
                  className="mt-2 p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Options Input */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                {question.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...question.options];
                      updatedOptions[optionIndex] = e.target.value;
                      handleQuestionChange(index, "options", updatedOptions);
                    }}
                    className="mt-2 p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                ))}
              </div>

              {/* Correct Answer Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Choose Correct Answer
                </label>
                <select
                  value={question.answer}
                  onChange={(e) =>
                    handleQuestionChange(index, "answer", e.target.value)
                  }
                  className="mt-2 p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select correct answer</option>
                  {question.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition"
          >
            Save Quiz
          </button>
        </form>
      </div>

      {/* Sidebar for Image Selection */}
      <div className="lg:w-1/4 mt-8 lg:mt-0">
        <div>
          <ImageSelector />
        </div>
      </div>
    </div>
  );
};

export default MCQForm;
