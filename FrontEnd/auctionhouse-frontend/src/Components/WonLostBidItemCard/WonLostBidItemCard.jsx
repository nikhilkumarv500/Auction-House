import React, { useState } from "react";
import "./WonLostBidItemCard.scss";
import SpotlightCard from "../SpolightCard/SpotlightCard";

const WonLostBidItemCard = ({ children, itemDataObj }) => {
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
      <div className="my-bid-wonlost-individual-bid-items-card-border">
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(0, 0, 0, 0.2)"
        >
          <div className="my-bid-wonlost-individual-bid-items-card-inner-wrapper">
            <div className="my-bid-wonlost-individual-bid-items-card-inner-upper-section">
              <div className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-image-section">
                <img src={bidItemObj.item_image_url} alt="No image available" />
              </div>
              <div className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section">
                <div className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section-top-container">
                  <p className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section-item-name gold-text">
                    {bidItemObj.item_name || "Item name"}
                  </p>
                  <p className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section-item-description">
                    {bidItemObj.item_description || "Item description"}
                  </p>
                  <p className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section-item-your-bid-amount">
                    Your total bid amount :{" "}
                    <span className="">
                      ₹{" "}
                      {bidItemObj.bidder_total_amount_spent ||
                        "Your Bid amount"}
                    </span>
                  </p>
                  <p className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section-item-owner-name-old-bid-page">
                    Posted by : {bidItemObj.sell_user_name || "Owner name"}
                  </p>
                  <p className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section-item-sold-to-name-old-bid-page">
                    Sold to : {bidItemObj.purchase_user_name || "Buyer name"}
                  </p>
                </div>
                <div className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section-bottom-container">
                  <p className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section-bottom-container-left-section">
                    Start date :{" "}
                    {bidItemObj.bid_start_date_time
                      ? formatDate(bidItemObj.bid_start_date_time)
                      : "0-0-0"}
                  </p>
                  <div className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section-bottom-container-horizontal-divider"></div>
                  <p className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section-bottom-container-right-section">
                    End date :{" "}
                    {bidItemObj.bid_end_date_time
                      ? formatDate(bidItemObj.bid_end_date_time)
                      : "9-9-9"}
                  </p>
                </div>

                <div className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section-end-timer">
                  <span>STATUS : </span>
                  {bidItemObj.bid_won && <div className="bid-won">WON</div>}
                  {!bidItemObj.bid_won && <div className="bid-lost">LOST</div>}
                </div>

                <div className="my-bid-wonlost-individual-bid-items-card-inner-upper-section-middle-section-bid-id">
                  <p>
                    Bid id : <span>{bidItemObj.bid_id}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="my-bid-wonlost-individual-bid-items-card-inner-lower-section">
              <div className="my-bid-wonlost-individual-bid-items-card-inner-lower-section-left-container-bid-page">
                <p className="my-bid-wonlost-individual-bid-items-card-inner-lower-section-left-container-highest-bid big-text gold-text">
                  Purchased at : ₹ {bidItemObj.purchase_price || 0}
                </p>
                <div className="vertical-line"></div>
                <p className="my-bid-wonlost-individual-bid-items-card-inner-lower-section-left-container-starting-price">
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

export default WonLostBidItemCard;
