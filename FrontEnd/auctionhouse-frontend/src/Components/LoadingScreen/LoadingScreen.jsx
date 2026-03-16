import React from "react";
import "./LoadingScreen.scss";
import Dog from "../LoadAnimals/Dog/Dog";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      {/* <section className="loader">
        <div className="slider" style={{ "--i": "0" }}></div>
        <div className="slider" style={{ "--i": "1" }}></div>
        <div className="slider" style={{ "--i": "2" }}></div>
        <div className="slider" style={{ "--i": "3" }}></div>
        <div className="slider" style={{ "--i": "4" }}></div>
      </section> */}

      <Dog />
      <div className="loading-text loading-screen-text">Loading...</div>
    </div>
  );
};

export default LoadingScreen;
