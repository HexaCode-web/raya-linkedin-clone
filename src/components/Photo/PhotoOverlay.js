import React, { useEffect } from "react";

const PhotoOverlay = ({ photoURL, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listener for keydown event
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  return (
    <div className="overlay">
      <div className="overlay-content">
        <img src={photoURL} alt="Enlarged Photo" />
        <button className="Delete-btn" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default PhotoOverlay;
