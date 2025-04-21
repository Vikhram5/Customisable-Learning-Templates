import React, { useState, useEffect } from "react";
import QuizSettings from "./QuizSettings";

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isQuestionRead, setIsQuestionRead] = useState(false);
  const [isCyclingOptions, setIsCyclingOptions] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [spokenOptions, setSpokenOptions] = useState(new Set());

  const [settings, setSettings] = useState({
    cycleSpeed: 4000,
    backgroundColor: "#f0fdf4",
    fontSize: "10px",
    fontColor: "#000000",
    questionBoxSize: "max-w-4xl",
    optionsBoxSize: "max-w-xl",
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userRole, setUserRole] = useState("teacher");

  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions))
      .catch((err) => console.error("Error loading JSON:", err));

    fetch("/settings_quiz.json")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => {
        console.error("Error loading settings:", err);
        alert(
          "Failed to load settings. Please check the server configuration."
        );
      });
  }, []);

  useEffect(() => {
    if (isCyclingOptions && !isAnswered && questions.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(
          (prev) => (prev + 1) % questions[currentQuestionIndex].options.length
        );
      }, settings.cycleSpeed);

      return () => clearInterval(interval);
    }
  }, [
    isAnswered,
    questions,
    currentQuestionIndex,
    isCyclingOptions,
    settings.cycleSpeed,
  ]);

  useEffect(() => {
    if (isCyclingOptions && !spokenOptions.has(currentIndex)) {
      speak(questions[currentQuestionIndex].options[currentIndex]);
      setSpokenOptions((prev) => new Set(prev.add(currentIndex)));
    }
  }, [
    currentIndex,
    isCyclingOptions,
    questions,
    spokenOptions,
    currentQuestionIndex,
  ]);

  const handleClick = () => {
    if (isSettingsOpen) return;

    if (clickCount === 0) {
      setClickCount(clickCount + 1);
      setIsQuestionRead(true);
      speak(questions[currentQuestionIndex].question);
    } else if (clickCount === 1) {
      setClickCount(clickCount + 1);
      setIsQuestionRead(true);
    } else if (clickCount === 2) {
      setClickCount(clickCount + 1);
      setIsQuestionRead(true);
      speak(questions[currentQuestionIndex].question);
    } else if (clickCount === 3) {
      setClickCount(clickCount + 1);
      setIsCyclingOptions(true);
      setIsQuestionRead(true);
    } else if (!isAnswered) {
      const selectedOption =
        questions[currentQuestionIndex].options[currentIndex];
      setIsAnswered(true);
      setIsCorrect(selectedOption === questions[currentQuestionIndex].answer);

      speak(
        selectedOption === questions[currentQuestionIndex].answer
          ? "Correct answer!"
          : "Wrong answer!"
      );

      if (selectedOption === questions[currentQuestionIndex].answer) {
        const isLastQuestion = currentQuestionIndex === questions.length - 1;

        setTimeout(() => {
          if (isLastQuestion) {
            speak("Quiz completed!");
            setTimeout(() => {
              window.location.href = "/student-dashboard";
            }, 2000);
          } else {
            setIsAnswered(false);
            setCurrentIndex(0);
            setCurrentQuestionIndex((prev) => prev + 1);
            setIsCyclingOptions(false);
            setClickCount(0);
            setSpokenOptions(new Set());
          }
        }, 2000);
      } else {
        setTimeout(() => {
          setIsAnswered(false);
          setCurrentIndex(0);
          setSpokenOptions(new Set());
        }, 2000);
      }
    }
  };

  const speak = (text, voiceName = "Google US English") => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find((voice) => voice.name === voiceName);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    speechSynthesis.speak(utterance);
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  if (questions.length === 0)
    return <p className="text-center mt-10">Loading...</p>;

  const { question, image, options, answer } = questions[currentQuestionIndex];

  return (
    <div
      className="flex flex-col items-center min-h-screen p-4"
      style={{ backgroundColor: settings.backgroundColor }}
      onClick={handleClick}
    >
      {userRole === "teacher" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSettings();
          }}
          className="mb-4 p-2 bg-blue-500 text-white rounded"
        >
          {isSettingsOpen ? "Close Settings" : "Open Settings"}
        </button>
      )}

      {isSettingsOpen && userRole === "teacher" && (
        <QuizSettings onSave={setSettings} />
      )}

      <div
        className={`bg-white p-5 rounded-lg shadow-lg text-center w-full ${
          settings.questionBoxSize
        } border-4 border-red-500 transition-all ${
          isQuestionRead || clickCount < 3 ? "opacity-100" : "opacity-0"
        }`}
        style={{
          fontSize: settings.fontSize,
          color: settings.fontColor,
        }}
      >
        <p className={`font-bold ${settings.fontSize} ${settings.fontColor}`}>
          {question}
        </p>
      </div>

      {image && (
        <div className=" p-4 rounded-lg shadow-lg mt-4 w-64 h-64 flex items-center justify-center border border-gray-300 transition-transform duration-500 ease-in-out">
          <img
            src={`/symbols/${image}`}
            alt="Question Visual"
            className={`w-60 h-60 object-contain transition-transform duration-500 ease-in-out ${
              clickCount === 2 ? "scale-200" : "scale-100"
            }`}
          />
        </div>
      )}

      <div
        className={`grid grid-cols-2 gap-8 mt-6 w-full ${settings.optionsBoxSize} border-4 border-red-500 p-5 transition-all`}
      >
        {options.map((option, index) => (
          <div
            key={option}
            className={`p-4 text-center rounded-lg shadow-md font-semibold border border-gray-300 transition-all cursor-pointer
    ${
      isAnswered && index === currentIndex
        ? option === answer
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
        : index === currentIndex && isCyclingOptions
        ? "bg-blue-500 text-white scale-110"
        : "bg-white text-black"
    }`}
            style={{
              fontSize: settings.fontSize,
              fontColor: settings.fontColor,
            }}
          >
            {option}
          </div>
        ))}
      </div>

      {isAnswered && (
        <p
          className={`mt-4 text-lg font-bold ${
            isCorrect ? "text-white-700" : "text-white-600"
          }`}
        >
          {isCorrect ? "✅ Correct!" : "❌ Incorrect!"}
        </p>
      )}
    </div>
  );
};

export default QuizGame;