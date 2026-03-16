import React from "react";
import "./ColorExanderMotionbutton.scss";

const ColorExanderMotionbutton = ({
  buttonLabel,
  onClickFunction,
  className,
}) => {
  return (
    <button
      className={`color-expander-motion-button ${className ? className : ""}`}
      onClick={onClickFunction}
    >
      {buttonLabel}
    </button>
  );
};

export default ColorExanderMotionbutton;
