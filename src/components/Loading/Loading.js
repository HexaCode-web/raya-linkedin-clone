import React from "react";
import "./loading.css";
const Loading = ({ loading }) => {
  return (
    <div className={`Loading-wrapper ${loading ? "" : "FADE"}`}>
      <div className="ring">
        RAYA <span></span>
      </div>
    </div>
  );
};
export default Loading;
