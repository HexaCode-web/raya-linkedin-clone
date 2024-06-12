import React, { useEffect, useState } from "react";
import "./Nav.css";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import Logo from "../../assests/logo.jpg";
const Nav = ({ screenWidth, User, SearchValue, setSearchValue }) => {
  const [Color, setColor] = useState(false);

  const ChangeColor = () => {
    if (screenWidth < 500) {
      if (window.scrollY >= 20) {
        setColor(true);
      } else {
        setColor(false);
      }
    } else {
      if (window.scrollY >= 60) {
        setColor(true);
      } else {
        setColor(false);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", () => {
      ChangeColor();
    });
  }, []);

  return (
    <div
      className={`NavContainer animate__animated animate__fadeInDown ${
        Color ? "NavContainer-bg" : ""
      }`}
    >
      <img
        src={Logo}
        onClick={() => {
          window.location.href = "/";
        }}
        className={`Logo ${Color ? "Small" : ""}`}
      />
      {screenWidth > 1000 ? (
        <NavDesktop
          setSearchValue={setSearchValue}
          SearchValue={SearchValue}
          User={User}
        />
      ) : (
        <NavMobile User={User} />
      )}
    </div>
  );
};

export default Nav;
