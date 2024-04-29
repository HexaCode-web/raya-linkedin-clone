import React, { useState } from "react";
import "./HamburgerButton.css";
const HamburgerButton = ({ onToggleMenu, isMenuOpen }) => {
  const [isOpen, setIsOpen] = useState(isMenuOpen ? isMenuOpen : false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    onToggleMenu(!isOpen); // Notify parent component about menu state change
  };

  return (
    <button
      className={`hamburger ${isOpen ? "open" : ""}`}
      onClick={toggleMenu}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};

export default HamburgerButton;
