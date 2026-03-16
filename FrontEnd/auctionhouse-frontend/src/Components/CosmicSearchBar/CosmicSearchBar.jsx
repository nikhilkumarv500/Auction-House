import React from "react";
import "./CosmicSearchBar.scss";

const CosmicSearchBar = ({
  width = "600px",
  seachPlaceholder = "Enter the text",
  searchText,
  setSearchText,
  onSearchButtonClick,
  onSearchClearCall,
}) => {
  return (
    <>
      <div id="search-container">
        <div id="main">
          <input
            className="input"
            name="text"
            type="text"
            placeholder={seachPlaceholder}
            style={{
              width: width,
              paddingRight: !searchText === false ? "87px" : "59px",
            }}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target?.value);
            }}
            autoComplete="off"
          />
          {!searchText === false && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#ffffff"
              className="cosmic-search-cross-mark"
              onClick={() => {
                setSearchText("");
                if (!onSearchClearCall === false) onSearchClearCall();
              }}
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
                  fill="#ffffff"
                ></path>
              </g>
            </svg>
          )}
          <div id="input-mask"></div>
          <div id="cosmic-glow"></div>
          <div className="wormhole-border"></div>
          <div id="wormhole-icon">
            <svg
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              stroke="url(#cosmic-search)"
              fill="none"
              height="24"
              width="24"
              viewBox="0 0 24 24"
              onClick={() => {
                onSearchButtonClick();
              }}
            >
              <circle r="8" cy="11" cx="11"></circle>
              <line y2="16.65" x2="16.65" y1="21" x1="21"></line>
              <defs>
                <linearGradient
                  gradientTransform="rotate(45)"
                  id="cosmic-search"
                >
                  <stop stopColor="#a9c7ff" offset="0%"></stop>
                  <stop stopColor="#6e8cff" offset="100%"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div id="search-icon"></div>
        </div>
      </div>
    </>
  );
};

export default CosmicSearchBar;
