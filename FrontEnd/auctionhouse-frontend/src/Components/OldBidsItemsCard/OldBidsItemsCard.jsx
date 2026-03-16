import React, { useState } from "react";
import "./OldBidsItemsCard.scss";
import SpotlightCard from "../SpolightCard/SpotlightCard";

const OldBidsItemsCard = ({ children, itemDataObj }) => {
  const [bidItemObj, setBidItemObj] = useState(itemDataObj);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12
    hours = String(hours).padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <>
      <div className="individual-bid-items-card-border">
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(0, 0, 0, 0.2)"
        >
          <div className="individual-bid-items-card-inner-wrapper">
            <div className="individual-bid-items-card-inner-upper-section">
              <div className="individual-bid-items-card-inner-upper-section-image-section">
                <img src={bidItemObj.item_image_url} alt="No image available" />
              </div>
              <div className="individual-bid-items-card-inner-upper-section-middle-section">
                <div className="individual-bid-items-card-inner-upper-section-middle-section-top-container">
                  <p className="individual-bid-items-card-inner-upper-section-middle-section-item-name gold-text">
                    {bidItemObj.item_name || "Item name"}
                  </p>
                  <p className="individual-bid-items-card-inner-upper-section-middle-section-item-description">
                    {bidItemObj.item_description || "Item description"}
                  </p>
                  <p className="individual-bid-items-card-inner-upper-section-middle-section-item-owner-name-old-bid-page">
                    Hosted by : {bidItemObj.sell_user_name || "Owner name"}
                  </p>
                  <p className="individual-bid-items-card-inner-upper-section-middle-section-item-sold-to-name-old-bid-page">
                    Sold to : {bidItemObj.purchase_user_name || "None"}
                  </p>
                </div>
                <div className="individual-bid-items-card-inner-upper-section-middle-section-bottom-container">
                  <p className="individual-bid-items-card-inner-upper-section-middle-section-bottom-container-left-section">
                    Start date :{" "}
                    {bidItemObj.bid_start_date_time
                      ? formatDate(bidItemObj.bid_start_date_time)
                      : "0-0-0"}
                  </p>
                  <div className="individual-bid-items-card-inner-upper-section-middle-section-bottom-container-horizontal-divider"></div>
                  <p className="individual-bid-items-card-inner-upper-section-middle-section-bottom-container-right-section">
                    End date :{" "}
                    {bidItemObj.bid_end_date_time
                      ? formatDate(bidItemObj.bid_end_date_time)
                      : "9-9-9"}
                  </p>
                </div>

                <div className="individual-bid-items-card-inner-upper-section-middle-section-end-timer">
                  <span>STATUS : </span>
                  {bidItemObj.purchase_price !== null && (
                    <div className="live-indicator">SOLD</div>
                  )}
                  {bidItemObj.purchase_price === null && (
                    <div className="live-indicator">NONE BOUGHT</div>
                  )}
                </div>

                <div className="individual-bid-items-card-inner-upper-section-middle-section-bid-id">
                  <p>
                    Bid id : <span>{bidItemObj.bid_id}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="individual-bid-items-card-inner-lower-section">
              <div className="individual-bid-items-card-inner-lower-section-left-container-bid-page">
                {bidItemObj.purchase_price !== null && (
                  <p className="individual-bid-items-card-inner-lower-section-left-container-highest-bid big-text gold-text">
                    Purchased at : ₹{" "}
                    {bidItemObj.purchase_price || "No one bought"}
                  </p>
                )}
                {bidItemObj.purchase_price === null && (
                  <p className="individual-bid-items-card-inner-lower-section-left-container-highest-bid big-text">
                    None bought
                  </p>
                )}
                <div className="vertical-line"></div>
                <p className="individual-bid-items-card-inner-lower-section-left-container-starting-price">
                  Started at : ₹ {bidItemObj.item_price || 0}
                </p>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </>
  );
};

export default OldBidsItemsCard;
