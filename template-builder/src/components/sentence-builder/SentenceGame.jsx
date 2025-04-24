import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const apiBaseUrl = import.meta.env.VITE_BASE_URL;
import sentenceBackground from "../../assets/sentence_builder.png";

const SentenceGame = () => {
  const [sentences, setSentences] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [jumbledSentence, setJumbledSentence] = useState([]);
  const [arrangedWords, setArrangedWords] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(true);
  const [incorrectWord, setIncorrectWord] = useState(null);
  const [sentenceIndex, setSentenceIndex] = useState(0);

  const [scanSpeed, setScanSpeed] = useState(3000);
  const [fontSize, setFontSize] = useState("text-2xl");
  const [fontColor, setFontColor] = useState("#000000");
  const [boxColor, setBoxColor] = useState("#AEFF00");

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const shuffleArray = (array, correctAnswer) => {
    let shuffled = [...array];
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (shuffled[0] === correctAnswer);
    return shuffled;
  };

  useEffect(() => {
    fetch("/selected_images.json")
      .then((response) => response.json())
      .then((data) => {
        setSentences(data);
        if (data.length > 0) {
          loadSentence(0, data);
        }
      });
  }, []);

  const loadSentence = (index, data) => {
    if (index >= data.length) {
      console.log("All sentences completed!");
      navigate("/student-dashboard");
      return;
    }

    const sentenceData = data[index];
    const sentence = sentenceData.sentence.split(" ");
    const shuffledSentence = shuffleArray(sentence);
    setCorrectOrder(sentence);
    setJumbledSentence(shuffledSentence);
    setArrangedWords(new Array(sentence.length).fill(""));
    setSelectedImages(sentenceData.image_names);
    setIsShuffling(true);
    setSentenceIndex(index);
  };

  useEffect(() => {
    let interval;
    if (isShuffling && jumbledSentence.length > 0) {
      interval = setInterval(() => {
        setHighlightedIndex((prevIndex) => (prevIndex + 1) % jumbledSentence.length);
      }, scanSpeed);
    }
    return () => clearInterval(interval);
  }, [isShuffling, jumbledSentence, scanSpeed]);

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find((voice) => voice.name === "Aaron");
    if (selectedVoice) utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (jumbledSentence.length > 0) speakWord(jumbledSentence[highlightedIndex]);
  }, [highlightedIndex, jumbledSentence]);

  const handleWordSelection = () => {
    if (!isShuffling || jumbledSentence.length === 0) return;

    const selectedWord = jumbledSentence[highlightedIndex];
    const emptyIndex = arrangedWords.indexOf("");

    if (emptyIndex !== -1) {
      if (selectedWord === correctOrder[emptyIndex]) {
        const newArrangedWords = [...arrangedWords];
        newArrangedWords[emptyIndex] = selectedWord;
        setArrangedWords(newArrangedWords);

        const updatedJumbled = jumbledSentence.filter((_, i) => i !== highlightedIndex);
        setJumbledSentence(updatedJumbled);

        if (updatedJumbled.length === 0) {
          setIsShuffling(false);
          setTimeout(() => loadNextSentence(), 3000);
        } else {
          setHighlightedIndex(0);
        }
        setIncorrectWord(null);
      } else {
        setIncorrectWord(selectedWord);
      }
    }
  };

  const loadNextSentence = () => {
    if (sentenceIndex + 1 < sentences.length) {
      loadSentence(sentenceIndex + 1, sentences);
    } else {
      console.log("Game Over: All sentences completed!");
      navigate("/student-dashboard");
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleClearData = async () => {
    const confirmed = window.confirm("Are you sure you want to clear all data?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${apiBaseUrl}/clear-selected-images`, { method: "DELETE" });
      const result = await response.json();
      if (result.status === "success") {
        alert("Data cleared successfully!");
        setSentences([]);
        setSelectedImages([]);
        setCorrectOrder([]);
        setJumbledSentence([]);
        setArrangedWords([]);
        setSentenceIndex(0);
      } else {
        alert("Failed to clear data: " + result.message);
      }
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("An error occurred while clearing the data.");
    }
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url(${sentenceBackground})`,
        backgroundSize: "cover",
      }}
    >
      {isSettingsOpen && (
        <div className="w-64 bg-white p-4 border-r-2">
          <h2 className="text-lg font-bold mb-4">Settings</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium">Scan Speed (seconds)</label>
            <input
              type="number"
              min="1"
              step="1"
              value={scanSpeed / 1000}
              onChange={(e) => setScanSpeed(Number(e.target.value) * 1000)}
              className="w-full border p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Font Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full border p-2 mt-1"
            >
              <option value="text-xl">Small</option>
              <option value="text-2xl">Medium</option>
              <option value="text-3xl">Large</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Font Color</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="w-full mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Word Box Color</label>
            <input
              type="color"
              value={boxColor}
              onChange={(e) => setBoxColor(e.target.value)}
              className="w-full mt-1"
            />
          </div>
          <button
            onClick={handleClearData}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Clear Data
          </button>
        </div>
      )}

      <button
        className="fixed top-4 left-4 z-50 bg-yellow-500 text-black font-bold px-4 py-2 rounded shadow-md"
        onClick={toggleSettings}
      >
        {isSettingsOpen ? "Close Settings" : "Open Settings"}
      </button>

      <div
        className="flex-1 flex flex-col items-center justify-center p-6"
        onClick={handleWordSelection}
      >
        <div className="flex space-x-4 mb-6">
          {selectedImages.map((imageName, index) => {
            const [word] = imageName.split("_");
            return (
              <img
                key={index}
                src={`/images/${word}/${imageName}`}
                alt={imageName}
                className="w-50 h-50 object-cover border-2 border-gray-400 rounded-lg"
              />
            );
          })}
        </div>

        <div className="flex space-x-4 mb-6">
          {jumbledSentence.map((word, index) => (
            <div
              key={index}
              className={`${fontSize} font-semibold p-4 rounded-lg shadow-lg transition-all`}
              style={{
                backgroundColor: incorrectWord === word ? "#FCA5A5" : boxColor,
                color: fontColor,
                border: index === highlightedIndex ? "4px solid red" : "2px solid transparent",
                transform: index === highlightedIndex ? "scale(1.05)" : "scale(1)",
              }}
            >
              {word}
            </div>
          ))}
        </div>

        <div className="flex space-x-4 mb-6">
          {arrangedWords.map((word, index) => (
            <div
              key={index}
              className={`${fontSize} font-semibold bg-blue-200 p-4 rounded-lg shadow-lg w-32 flex items-center justify-center`}
              style={{ color: fontColor }}
            >
              {word}
            </div>
          ))}
        </div>

        {incorrectWord && (
          <p className="text-xl text-red-700 mt-4">Incorrect! Try again.</p>
        )}
      </div>
    </div>
  );
};

export default SentenceGame;