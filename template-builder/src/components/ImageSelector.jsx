import { useState, useEffect } from "react";

const ImageSelector = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [symbols, setSymbols] = useState([]);
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    fetch("/symbols.json")
      .then((response) => response.json())
      .then((data) => setSymbols(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error loading symbols:", error));
  }, []);

  useEffect(() => {
    setFilteredSymbols(
      searchTerm.trim()
        ? symbols.filter((symbol) =>
            symbol.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : []
    );
  }, [searchTerm, symbols]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          right: "20px",
          top: "20px",
          zIndex: 1000,
          background: "#333",
          color: "#fff",
          border: "none",
          padding: "10px 15px",
          fontSize: "20px",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background 0.3s ease",
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          width: "280px",
          borderLeft: "2px solid rgba(0, 0, 0, 0.1)",
          padding: "12px",
          background: "linear-gradient(135deg, #ffffff, #f1f1f1)",
          boxShadow: "-4px 0 10px rgba(0, 0, 0, 0.1)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s ease-in-out",
          overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          style={{
            position: "absolute",
            top: "10px",
            left: "-40px",
            background: "#333",
            color: "#fff",
            border: "none",
            padding: "10px",
            fontSize: "18px",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
        >
          ✖
        </button>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search symbols..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            boxShadow: "inset 2px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        />

        {searchTerm.trim() && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)", // 2 images per row
              gap: "12px",
              paddingBottom: "10px",
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            {filteredSymbols.length > 0 ? (
              filteredSymbols.map((symbol, index) => (
                <img
                  key={index}
                  src={`/symbols/${symbol}`}
                  alt={symbol}
                  width={90}
                  height={90}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", symbol)
                  }
                  style={{
                    cursor: "grab",
                    borderRadius: "10px",
                    border: "2px solid rgba(0, 0, 0, 0.1)",
                    padding: "5px",
                    backgroundColor: "#fff",
                    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.1) rotate(2deg)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.transform = "scale(1) rotate(0deg)")
                  }
                />
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#666" }}>
                No results found
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ImageSelector;