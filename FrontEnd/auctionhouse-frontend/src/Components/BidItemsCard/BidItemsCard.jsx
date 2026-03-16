import React, { useEffect, useState } from "react";
import "./BidItemsCard.scss";
import SpotlightCard from "../SpolightCard/SpotlightCard";
import CountdownTimer from "../CountDownTimer/CountDownTimer";
import ColorExanderMotionbutton from "../ColorExanderMotionbutton/ColorExanderMotionbutton";
import { useStore } from "../../Config/StoreContext/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ProcessingBlinkText from "../BlinkText/ProcessingBlinkText";

const BidItemsCard = ({ children, itemDataObj, onDoWhenBidExpire }) => {
  const apiGatewayBackendUrl = import.meta.env.VITE_GATEWAY_API_BE_URL || "";

  const [bidItemObj, setBidItemObj] = useState(itemDataObj);

  const { globalStore, setGlobalStore, setGlobalLoading } = useStore();
  const [isLoggedInUserTheOwner, setIsLoggedInUserTheOwner] = useState(false);
  const [isCurrentBidEndTimeExpired, setIsCurrentBidEndTimeExpired] =
    useState(false);
  const [isBulkUpadateAutomaticComplete, setIsBulkUpadateAutomaticComplete] =
    useState(false);

  const navigate = useNavigate();

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

  const onOpenChatRoomButtonClick = () => {
    setGlobalStore((prev) => {
      return {
        ...prev,
        bidPageChatRoom: itemDataObj,
      };
    });
    navigate("/bidpage/chatRoom");
  };

  useEffect(() => {
    const isLoggedInUserTheOwnerVar =
      itemDataObj.sell_user_email === (globalStore.authpage?.userEmail || "");
    setIsLoggedInUserTheOwner(isLoggedInUserTheOwnerVar);
  }, []);

  // ********** start : when bid endTime expire , do bulk bid sell update
  let now = new Date().getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      now = new Date().getTime();

      if (
        bidItemObj.end_date_time != null &&
        now >= bidItemObj.end_date_time &&
        !isCurrentBidEndTimeExpired
      ) {
        setIsCurrentBidEndTimeExpired(true);
      }
    }, 1000);

    return () => clearInterval(timer); // cleanup
  }, []);

  useEffect(() => {
    if (isCurrentBidEndTimeExpired) {
      const jwtToken = globalStore.authpage?.jwtToken;

      if (jwtToken == null || !jwtToken) {
        navigate("/");
        setGlobalStore({});
        return;
      }

      axios
        .get(apiGatewayBackendUrl + "/apigateway/bid/bulkBidItemSell", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        .then((res) => {
          if (res.status != null && res.status === 200) {
            console.log("Dev (intentional) : Done bulk bid sell update");
            setIsBulkUpadateAutomaticComplete(true);
          } else {
            toast.error(
              "There was an issue while doing bid sell | could you please refresh the page",
              {
                autoClose: 5000,
              },
            );
          }
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message ||
              "There was an issue while doing bid sell | could you please refresh the page",
            {
              autoClose: 5000,
            },
          );
          return;
        });
    }
  }, [isCurrentBidEndTimeExpired]);

  // ----------- end : when bid endTime expire , do bulk bid sell update

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
                  <p className="individual-bid-items-card-inner-upper-section-middle-section-item-owner-name">
                    Posted by : {bidItemObj.sell_user_name || "Owner name"}
                  </p>
                </div>
                <div className="individual-bid-items-card-inner-upper-section-middle-section-bottom-container">
                  <p className="individual-bid-items-card-inner-upper-section-middle-section-bottom-container-left-section">
                    Start date :{" "}
                    {bidItemObj.post_date_time
                      ? formatDate(bidItemObj.post_date_time)
                      : "0-0-0"}
                  </p>
                  <div className="individual-bid-items-card-inner-upper-section-middle-section-bottom-container-horizontal-divider"></div>
                  <p className="individual-bid-items-card-inner-upper-section-middle-section-bottom-container-right-section">
                    End date :{" "}
                    {bidItemObj.end_date_time
                      ? formatDate(bidItemObj.end_date_time)
                      : "9-9-9"}
                  </p>
                </div>

                <div className="individual-bid-items-card-inner-upper-section-middle-section-end-timer">
                  <div className="live-indicator">
                    {!isCurrentBidEndTimeExpired && (
                      <>
                        <span className="live-dot"></span>
                        LIVE
                      </>
                    )}
                    {isCurrentBidEndTimeExpired && <>PROCESSING</>}
                  </div>
                  <div className="vertical-line"></div>
                  <CountdownTimer endTime={bidItemObj.end_date_time || 0} />
                </div>

                <div className="individual-bid-items-card-inner-upper-section-middle-section-bid-id">
                  <p>
                    Bid id : <span>{bidItemObj.bid_id}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="individual-bid-items-card-inner-lower-section">
              <div className="individual-bid-items-card-inner-lower-section-left-container">
                {bidItemObj.highest_bid && (
                  <>
                    <p className="individual-bid-items-card-inner-lower-section-left-container-highest-bid big-text gold-text">
                      Current bid : ₹ {bidItemObj.highest_bid || 0}
                    </p>
                    <div className="vertical-line"></div>
                    <p className="individual-bid-items-card-inner-lower-section-left-container-starting-price">
                      Starting price : ₹ {bidItemObj.item_price || 0}
                    </p>
                  </>
                )}
                {!bidItemObj.highest_bid && (
                  <>
                    <p className="individual-bid-items-card-inner-lower-section-left-container-starting-price big-text gold-text">
                      Starting price : ₹ {bidItemObj.item_price || 0}
                    </p>
                  </>
                )}
              </div>
              <div className="individual-bid-items-card-inner-lower-section-right-container">
                {isCurrentBidEndTimeExpired &&
                  !isBulkUpadateAutomaticComplete && (
                    <ProcessingBlinkText
                      className={
                        "individual-bid-items-card-inner-lower-section-right-container-blink-processing-text"
                      }
                    />
                  )}
                {!isCurrentBidEndTimeExpired &&
                  !isBulkUpadateAutomaticComplete && (
                    <ColorExanderMotionbutton
                      buttonLabel={
                        isLoggedInUserTheOwner ? "View/End  Bid" : "Enter Bid"
                      }
                      onClickFunction={onOpenChatRoomButtonClick}
                      className="individual-bid-items-card-inner-lower-section-right-container-button"
                    />
                  )}
                {isBulkUpadateAutomaticComplete && (
                  <ColorExanderMotionbutton
                    buttonLabel={"Click here to refresh bid status"}
                    onClickFunction={() => {
                      if (onDoWhenBidExpire) onDoWhenBidExpire();
                    }}
                    className="individual-bid-items-card-inner-lower-section-right-container-button"
                  />
                )}
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </>
  );
};

export default BidItemsCard;
