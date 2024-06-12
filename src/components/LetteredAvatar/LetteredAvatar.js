import React from "react";
import "./LetteredAvatar.css";
const LetteredAvatar = ({ Name, customHeight, customWidth }) => {
  const getFirstLetter = () => {
    if (Name?.length > 0) {
      return Name[0].toUpperCase();
    } else {
      return null;
    }
  };
  const getRandomColor = () => {
    // Define a list of possible colors
    const colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#800080",
      "#008000",
      "#000080",
      "#808000",
      "#800000",
      "#008080",
      "#800000",
      "#008080",
      "#000000",
      "#808080",
      "#c0c0c0",
      "#ffffff",
    ];

    // Pick a random index from the colors array
    const randomIndex = Math.floor(Math.random() * colors.length);

    // Return the color at the random index
    return colors[randomIndex];
  };
  return (
    <div
      className="letterImage"
      style={{
        backgroundColor: getRandomColor(),
        width: customWidth,
        height: customHeight,
      }}
    >
      <p>{getFirstLetter()}</p>
    </div>
  );
};

export default LetteredAvatar;
