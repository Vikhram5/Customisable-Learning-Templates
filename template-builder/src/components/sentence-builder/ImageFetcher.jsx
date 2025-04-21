import { useState } from "react";
const apiBaseUrl = import.meta.env.VITE_BASE_URL;
import loadingGif from '../../assets/loading_image.gif'

const stopwords = new Set([
  "to", "the", "and", "be", "a", "an", "is", "on", "at", "for", "with", "of", "am"
]);

const ImageFetcher = () => {
  const [sentence, setSentence] = useState("");
  const [wordImages, setWordImages] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchImages = async () => {
    if (!sentence.trim()) return;

    setLoading(true);
    setWordImages({});
    setSelectedImages([]);
    setFetched(false);

    console.log("Starting to fetch images for sentence:", sentence);

    const words = sentence
      .split(" ")
      .filter((word) => !stopwords.has(word.toLowerCase()));
    const uniqueWords = [...new Set(words)];

    console.log("Unique words after filtering stopwords:", uniqueWords);

    const imageRequests = uniqueWords.map(async (word) => {
      console.log(`Fetching images for word: ${word}`);
      try {
        const response = await fetch(`${apiBaseUrl}/get_images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word }),
        });
        const data = await response.json();
        console.log(`Received data for word "${word}":`, data);

        return { word: data.word, images: data.images || [] };
      } catch (error) {
        console.error(`Error fetching images for ${word}:`, error);
        return { word, images: [] };
      }
    });

    const results = await Promise.all(imageRequests);
    console.log("All image fetch results:", results);

    const imageMap = results.reduce((acc, { word, images }) => {
      acc[word] = images.map((img) => `/images/${word}/${img}`);
      return acc;
    }, {});

    console.log("Image map after processing results:", imageMap);

    setWordImages(imageMap);
    setLoading(false);
    setFetched(true);
  };

  const handleSelectImage = (image) => {
    if (!selectedImages.includes(image)) {
      setSelectedImages((prev) => [...prev, image]);
    }
  };

  const undoSelection = () => {
    setSelectedImages((prev) => prev.slice(0, -1));
  };

  const saveSelectedImagesToBackend = async () => {
    const imageNames = selectedImages.map((img) => img.split("/").pop());

    console.log("Saving selected images to backend:", imageNames);

    try {
      const response = await fetch(`${apiBaseUrl}/save_selected_images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence, imageNames }),
      });

      const data = await response.json();
      console.log("Backend response after saving:", data);
    } catch (error) {
      console.error("Error saving selected images and sentence:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <div className="p-8 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto mt-12">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Visual Sentence Builder
        </h1>

        <textarea
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevents new line
              fetchImages();
            }
          }}
          placeholder="Enter a sentence..."
          className="border-2 border-gray-300 p-6 rounded-lg mb-6 w-full h-28 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="text-center">
          <button
            onClick={fetchImages}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-300"
          >
            Fetch Images
          </button>
        </div>

        {loading && (
          <div className="text-center mt-8">
            <img
              src={loadingGif}
              alt="Loading..."
              className="w-50 h-50 mx-auto"
            />
          </div>
        )}

        {fetched && (
          <div className="mt-8 space-y-8">
            {Object.entries(wordImages).map(([word, images]) => (
              <div key={word}>
                <p className="text-2xl font-bold text-center text-gray-700">
                  {word}
                </p>
                {images.length > 0 ? (
                  <div className="flex flex-wrap gap-6 justify-center mt-4">
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={word}
                        className="w-32 h-32 cursor-pointer border-4 border-gray-300 rounded-xl transform hover:scale-105 hover:border-blue-500 transition duration-300"
                        onClick={() => handleSelectImage(img)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center mt-4">
                    No images found
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {fetched && selectedImages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">
              Selected Images
            </h2>
            <div className="flex gap-6 justify-center">
              {selectedImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Selected"
                  className="w-32 h-32 rounded-xl border-4 border-gray-300"
                />
              ))}
            </div>
            <button
              onClick={undoSelection}
              className="mt-6 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition duration-300"
            >
              Undo Selection
            </button>
          </div>
        )}

        {fetched && selectedImages.length > 0 && (
          <button
            onClick={saveSelectedImagesToBackend}
            className="mt-8 px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition duration-300"
          >
            Save Selected Images and Sentence
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageFetcher;
