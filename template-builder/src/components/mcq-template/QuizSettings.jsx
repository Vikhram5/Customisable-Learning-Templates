import React, { useState, useEffect } from "react";
const apiBaseUrl = import.meta.env.VITE_BASE_URL;

const QuizSettings = ({ onSave }) => {
  const [settings, setSettings] = useState({
    cycleSpeed: 4000, // in milliseconds
    backgroundColor: "#f0fdf4",
    fontSize: "16px",
    fontColor: "#000000",
    questionBoxSize: "max-w-md",
    questionBoxHeight: "auto",
    optionsBoxSize: "max-w-lg",
  });

  useEffect(() => {
    fetch(`${apiBaseUrl}/settings_quiz`)
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => {
        console.error("Error loading settings:", err);
        alert("Failed to load settings. Please check the server configuration.");
      });
  }, []);

  const handleSave = () => {
    fetch(`${apiBaseUrl}/save_settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })
      .then((res) => res.json())
      .then(() => onSave(settings))
      .catch((err) => console.error("Error saving settings:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: name === "cycleSpeed" ? parseInt(value) * 1000 : value,
    }));
  };

  return (
    <div className="fixed top-0 right-0 w-72 bg-white p-4 border-l-4 border-green-500 shadow-lg z-50">
      <h2 className="text-lg font-semibold text-center">Quiz Settings</h2>
      <div className="space-y-4 mt-4">
        <div>
          <label className="block">Scan Speed (seconds)</label>
          <input
            type="number"
            name="cycleSpeed"
            value={settings.cycleSpeed / 1000}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block">Background Color</label>
          <input
            type="color"
            name="backgroundColor"
            value={settings.backgroundColor}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block">Font Color</label>
          <input
            type="color"
            name="fontColor"
            value={settings.fontColor}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block">Font Size</label>
          <input
            type="text"
            name="fontSize"
            value={settings.fontSize}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block">Question Box Width</label>
          <select
            name="questionBoxSize"
            value={settings.questionBoxSize}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="max-w-2xl">Small</option>
            <option value="max-w-3xl">Medium</option>
            <option value="max-w-4xl">Large</option>
          </select>
        </div>

        <div>
          <label className="block">Options Box Width</label>
          <select
            name="optionsBoxSize"
            value={settings.optionsBoxSize}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="max-w-3xl">Small</option>
            <option value="max-w-4xl">Medium</option>
            <option value="max-w-5xl">Large</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full p-2 bg-blue-500 text-white rounded mt-4"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default QuizSettings;