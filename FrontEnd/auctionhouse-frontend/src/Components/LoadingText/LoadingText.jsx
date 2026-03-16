import React from "react";
import "./LoadingText.scss";

const LoadingText = ({ text }) => {
  return (
    <div className="loader-wrapper">
      <div className="circle-loader">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
      <div className="loading-text">{text}</div>
    </div>
  );
};

export default LoadingText;
