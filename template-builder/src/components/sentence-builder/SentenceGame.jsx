import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import sentenceBackground from '../../assets/sentence_builder.png'

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

  const navigate = useNavigate(); // Initialize useNavigate

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
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
        setHighlightedIndex(
          (prevIndex) => (prevIndex + 1) % jumbledSentence.length
        );
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isShuffling, jumbledSentence]);

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);

    const voices = speechSynthesis.getVoices();

    console.log(voices);
    const selectedVoice = voices.find((voice) => voice.name === "Aaron");

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (jumbledSentence.length > 0) {
      const wordToSpeak = jumbledSentence[highlightedIndex];
      speakWord(wordToSpeak);
    }
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

        const updatedJumbled = jumbledSentence.filter(
          (_, i) => i !== highlightedIndex
        );
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
      navigate("/student-dashboard"); // Redirect to student-dashboard
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      onClick={handleWordSelection}
      style={{
        backgroundImage: `url(${sentenceBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
      }}
    >
      <div className="flex space-x-4 mb-6">
        {selectedImages.map((imageName, index) => {
          const [word] = imageName.split("_");
          return (
            <div key={index} className="relative">
              <img
                src={`/images/${word}/${imageName}`}
                alt={imageName}
                className="w-48 h-48 object-cover border-4 border-gray-400 rounded-lg"
              />
            </div>
          );
        })}
      </div>

      <div className="flex space-x-4 mb-6">
        {jumbledSentence.map((word, index) => (
          <div
            key={index}
            className={`text-2xl font-semibold bg-yellow-300 p-4 rounded-lg shadow-lg transition-all ${
              index === highlightedIndex
                ? "border-4 border-red-500 scale-105"
                : ""
            } ${incorrectWord === word ? "bg-red-100" : ""}`}
          >
            {word}
          </div>
        ))}
      </div>

      <div className="flex space-x-4 mb-6">
        {arrangedWords.map((word, index) => (
          <div
            key={index}
            className="text-2xl font-semibold bg-blue-200 p-4 rounded-lg shadow-lg w-32 flex items-center justify-center"
          >
            {word}
          </div>
        ))}
      </div>

      {incorrectWord && (
        <p className="text-2xl text-black-800 mt-4">Incorrect! Try again.</p>
      )}
    </div>
  );
};

export default SentenceGame;
