import React from "react";
import "./ProcessingBlinkText.scss";

const ProcessingBlinkText = ({ staticText, blinkTextArr, className }) => {
  return (
    <div className={`blink-text ${className ? className : ""}`}>
      <div className="blink-text-loading-text">
        Processing results
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </div>
    </div>
  );
};

export default ProcessingBlinkText;
