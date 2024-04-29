import React, { useState, useEffect } from "react";
import HamburgerButton from "../HamburgerButton/HamburgerButton";
import "./NavMobile.css";

const NavMobile = ({ User }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const urlFormatted = window.location.href
    .split("/")
    .pop()
    .replace(/%20/g, " ");

  const toggleMenu = (isOpen) => {
    setIsMenuOpen(isOpen);
  };

  return (
    <>
      <HamburgerButton onToggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      {isMenuOpen && (
        <div className="SideMenu animate__animated animate__fadeInRight">
          <nav id="navbar" className="navbar">
            <ul>
              <li className={urlFormatted === "" ? "ActiveLink" : ""}>
                <a href="/">Home</a>
              </li>
            </ul>
          </nav>
          {User && (
            <li>
              <a href={"/Settings"}>Settings</a>
            </li>
          )}
        </div>
      )}
    </>
  );
};

export default NavMobile;
