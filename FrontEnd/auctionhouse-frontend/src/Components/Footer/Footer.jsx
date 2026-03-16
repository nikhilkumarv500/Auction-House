import React from "react";
import "./Footer.scss";
import RightArrowButton from "../RightArrowButton/RightArrowButton";
import { motion } from "framer-motion";

const Footer = () => {
  const portFolioUrl = import.meta.env.VITE_NIKHIL_KUMAR_V_PORTFOLIO_URL;

  return (
    <div className="general-footer-outer-container">
      <div className="general-footer-outer-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="general-footer-inner-wrapper">
            <div className="general-footer-inner-left-section">
              <img
                className="general-footer-inner-left-section-app-logo"
                src="/AuctionHouse_logo.png"
                alt="app-logo"
              />
              <p className="general-footer-inner-left-section-app-name">
                Auction House
              </p>
            </div>
            <div className="general-footer-inner-right-section">
              <RightArrowButton
                buttonLabel="Nikhil Kumar V's portfolio link"
                onClickFunction={() => window.open(portFolioUrl, "_blank")}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Footer;
