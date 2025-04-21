import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import matchBackground from '../../assets/matchBackground.png';

import correctSound from '../../assets/audio/correct_answer.mp3';
import incorrectSound from '../../assets/audio/wrong-answer.mp3';

const MatchUp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const [shuffledNames, setShuffledNames] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedNameIndex, setSelectedNameIndex] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [isCyclingImages, setIsCyclingImages] = useState(false);
  const [isCyclingNames, setIsCyclingNames] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [matchedThisPage, setMatchedThisPage] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const correctAudio = new Audio(correctSound);
  const incorrectAudio = new Audio(incorrectSound);

  const navigate = useNavigate(); 

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        navigate("/student-dashboard");
      }, 3000); //scan speed 
      return () => clearTimeout(timer);
    }
  }, [gameOver, navigate]);

  useEffect(() => {
    fetch("/match.json")
      .then((response) => response.json())
      .then((data) => setQuestions(data.questions))
      .catch((error) => console.error("Error loading match.json:", error));
  }, []);

  const currentPairs = questions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const derangeArray = (arr) => {
    // const n = arr.length;
    let result = [...arr];
    let attempts = 0;

    do {
      result = [...arr].sort(() => Math.random() - 0.5);
      attempts++;
    } while (result.some((item, idx) => item === arr[idx]) && attempts < 100);

    return result;
  };

  useEffect(() => {
    if (currentPairs.length > 0) {
      const names = currentPairs.map((pair) => pair.name);
      const shuffled = derangeArray(names);
      setShuffledNames(shuffled);
      setMatchedThisPage([]);
    }
  }, [currentPage, questions]);

  useEffect(() => {
    if (isCyclingImages && !gameOver) {
      const interval = setInterval(() => {
        setSelectedImageIndex((prev) => {
          const unmatchedIndexes = currentPairs
            .map((item, i) => (!matchedThisPage.includes(item.name) ? i : null))
            .filter((i) => i !== null);

          const currentUnmatchedIndex = unmatchedIndexes.indexOf(prev);
          const nextIndex =
            currentUnmatchedIndex === -1 || currentUnmatchedIndex === unmatchedIndexes.length - 1
              ? 0
              : currentUnmatchedIndex + 1;

          return unmatchedIndexes[nextIndex] ?? prev;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isCyclingImages, currentPairs, matchedThisPage, gameOver]);

  useEffect(() => {
    if (isCyclingNames && !gameOver) {
      const interval = setInterval(() => {
        setSelectedNameIndex((prev) => {
          const unmatchedIndexes = shuffledNames
            .map((name, i) => (!matchedThisPage.includes(name) ? i : null))
            .filter((i) => i !== null);

          const currentUnmatchedIndex = unmatchedIndexes.indexOf(prev);
          const nextIndex =
            currentUnmatchedIndex === -1 || currentUnmatchedIndex === unmatchedIndexes.length - 1
              ? 0
              : currentUnmatchedIndex + 1;

          return unmatchedIndexes[nextIndex] ?? prev;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isCyclingNames, shuffledNames, matchedThisPage, gameOver]);

  const handleClickAnywhere = () => {
    if (gameOver) return;

    setClickCount((prev) => prev + 1);
    setIsIncorrect(false);

    switch (clickCount) {
      case 0:
        setIsCyclingImages(true);
        break;
      case 1:
        setIsCyclingImages(false);
        setSelectedNameIndex(0);
        setIsCyclingNames(true);
        break;
      case 2:
        setIsCyclingNames(false);
        checkForMatch();
        break;
      default:
        resetRound();
        break;
    }
  };

  const checkForMatch = () => {
    const selectedName = shuffledNames[selectedNameIndex];
    const selectedImageName = currentPairs[selectedImageIndex]?.name;

    if (selectedName === selectedImageName) {
      correctAudio.play();
      const newMatches = [...matchedThisPage, selectedImageName];
      setMatchedThisPage(newMatches);

      if (newMatches.length === currentPairs.length) {
        if ((currentPage + 1) * itemsPerPage >= questions.length) {
          setGameOver(true);
        } else {
          setTimeout(() => {
            setCurrentPage((prev) => prev + 1);
            resetRound();
          }, 1000);
        }
      } else {
        setTimeout(resetRound, 1000);
      }
    } else {
      incorrectAudio.play();
      setIsIncorrect(true);
      setTimeout(resetRound, 1000);
    }
  };

  const resetRound = () => {
    const firstUnmatchedImage = currentPairs.findIndex(
      (item) => !matchedThisPage.includes(item.name)
    );
    setSelectedImageIndex(firstUnmatchedImage !== -1 ? firstUnmatchedImage : 0);
    setSelectedNameIndex(null);
    setClickCount(0);
    setIsCyclingImages(true);
    setIsIncorrect(false);
  };

  return (
    <div
      className="text-center p-8 min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${matchBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}

      onClick={handleClickAnywhere}
    >
      {gameOver ? (
        <div className="text-3xl font-bold text-black-600 mt-8">
          🎉 Game Over! You matched all pairs! 🎉
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <div className="flex justify-center gap-10 flex-col w-2/3 mx-auto p-6 rounded-lg ">
            {currentPairs.map((item, index) => (
              <div
                key={item.image}
                className="flex items-center justify-center gap-30 mb-4"
              >
                <div
                  className={`p-6 cursor-pointer border-2 ${
                    matchedThisPage.includes(item.name)
                      ? "bg-green-200 border-green-500"
                      : isIncorrect && index === selectedImageIndex
                      ? "bg-red-200 border-red-500 border-4 shadow-lg"
                      : index === selectedImageIndex && clickCount > 0
                      ? "border-red-500 border-4 shadow-lg"
                      : "border-blue-800 border-4 shadow-lg"
                  }`}
                >
                  <img
                    src={`/symbols/${item.image}`}
                    alt={item.name}
                    className="w-40 h-40"
                  />
                </div>
                <div
                  className={`p-6 cursor-pointer text-center w-50 text-2xl font-semibold rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl ${
                    matchedThisPage.includes(shuffledNames[index])
                      ? "bg-green-300 border-green-600 text-green-900 shadow-md ring-2 ring-green-500"
                      : isIncorrect && index === selectedNameIndex
                      ? "bg-red-300 border-red-600 text-red-900 border-4 shadow-lg animate-pulse"
                      : index === selectedNameIndex && clickCount > 0
                      ? "bg-yellow-200 border-yellow-500 text-yellow-900 border-4 shadow-md"
                      : "bg-white border-black text-gray-800"
                  }`}
                >
                  {shuffledNames[index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchUp;