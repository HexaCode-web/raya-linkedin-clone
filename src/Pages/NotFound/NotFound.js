import React from "react";
import "./NotFound.css";
const NotFound = () => {
  return (
    <div className="NotFound">
      <h1>404</h1>
      <p>that page doesn't exist or unavailable right now</p>
      <button
        onClick={() => {
          window.location.href = "/";
        }}
      >
        go back to home
      </button>
    </div>
  );
};

export default NotFound;
