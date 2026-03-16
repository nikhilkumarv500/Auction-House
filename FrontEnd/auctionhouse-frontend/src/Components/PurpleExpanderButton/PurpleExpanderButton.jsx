import React from "react";
import "./PurpleExpanderButton.scss";

const PurpleExpanderButton = ({ onClick, children, onSelected }) => {
  return (
    <button
      className={`purple-expander-button ${onSelected ? "purple-expander-button-selected" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PurpleExpanderButton;
