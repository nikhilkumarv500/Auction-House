import React, { useEffect, useRef, useState } from "react";
import "./BidPageChatRoom.scss";
import YellowShaderBackground from "../../Components/Shaders/YellowShaderBackground";
import AutoLoginService from "../../Services/AutoLoginService/AutoLoginService";
import Footer from "../../Components/Footer/Footer";
import { Button, Form } from "react-bootstrap";
import { useStore } from "../../Config/StoreContext/StoreContext";
import CountdownTimer from "../../Components/CountDownTimer/CountDownTimer";
import RightArrowButton from "../../Components/RightArrowButton/RightArrowButton";
import { useNavigate } from "react-router-dom";
import apiCall from "../../Config/AxiosConfig/apiCall";
import { toast } from "react-toastify";
import CubeSpinner from "../../Components/CubeSpinner/CubeSpinner";
import {
  connectBidPageChatRoomSocket,
  disconnectBidPageChatRoomSocket,
} from "../../WebSocketServices/BidPageChatRoomWebsocket";
import { generalBalanceAmountUpdateApiCall } from "../../lib/GeneralApiCalls";

const BidPageChatRoom = () => {
  const [isAuthenticatedFromCallingPage, setIsAuthenticatedFromCallingPage] =
    useState(null);

  const { globalStore, setGlobalStore, setGlobalLoading } = useStore();

  const chatContainerRef = useRef(null);

  const navigate = useNavigate();

  const [chatRoomPageState, setChatRoomPageState] = useState(null);
  const [chatRoomMessagesList, setChatRoomMessagesList] = useState(null);
  const [chatRoomTotalMoneySpent, setChatRoomTotalMoneySpent] = useState(0);
  const [bidInfoErrorComponent, setBidInfoErrorComponent] = useState({
    error: true,
    component: <></>,
  });
  const [onUserEnterNewBid, setOnUserEnterNewBid] = useState(null);
  const [isLoggedInUserTheOwner, setIsLoggedInUserTheOwner] = useState(false);
  const [isCurrentBidEndTimeExpired, setIsCurrentBidEndTimeExpired] =
    useState(false);

  // ********** start : load all bid chats

  const loadAllBidChats = async (bid_id) => {
    const jwtToken = globalStore.authpage?.jwtToken;

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    if (bid_id === null) {
      navigate("/bidpage");
      return;
    }

    setGlobalLoading(true);

    let res = null;
    try {
      res = await apiCall.get(`apigateway/chat/getBidChatFor/${bid_id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "LoadAllBidChats api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    }

    if (!res.data || res.data?.error) {
      toast.error(res.data?.message || "LoadAllBidChats api error", {
        autoClose: 5000,
      });
      setGlobalLoading(false);
      return;
    } else {
      const bidChatList = res.data?.bidChatList || [];

      setChatRoomMessagesList(bidChatList);
      // toast.success("Fetched active bids");
      setGlobalLoading(false);
    }
  };

  // --------- end : load all bid chats

  // ********** start : load higest amount spent

  const loadUserTotalSpentAmount = async (bid_id) => {
    const jwtToken = globalStore.authpage?.jwtToken;
    const userEmail = globalStore.authpage?.userEmail;

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    if (userEmail === null || bid_id === null) {
      navigate("/bidpage");
      return;
    }

    const payloadObj = {
      user_email: userEmail,
      bid_id: bid_id,
    };

    setGlobalLoading(true);

    let res = null;
    try {
      res = await apiCall.post(`apigateway/chat/getBidAmountFor`, payloadObj, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "LoadUserTotalSpentAmount api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    }

    if (!res.data || res.data?.error) {
      toast.error(res.data?.message || "LoadUserTotalSpentAmount api error", {
        autoClose: 5000,
      });
      setGlobalLoading(false);
      return;
    } else {
      const total_amount_spent = res.data?.total_amount_spent || 0;

      setChatRoomTotalMoneySpent(total_amount_spent);
      // setChatRoomTotalMoneySpent(0);
      // toast.success("Fetched active bids");
      setGlobalLoading(false);
    }
  };

  // --------- end : load higest amount spent

  // ********* start : submit new bid button click

  const onSubmitBidButtonClick = async () => {
    if (bidInfoErrorComponent.error) return;

    const jwtToken = globalStore.authpage?.jwtToken;
    const bid_id = globalStore.bidPageChatRoom?.bid_id;
    const purchase_user_email = globalStore.authpage?.userEmail;
    const purchase_user_name = globalStore.authpage?.userName;
    const purchase_price = onUserEnterNewBid;

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    if (
      bid_id === null ||
      purchase_user_email === null ||
      purchase_user_name === null ||
      purchase_price === null ||
      !bid_id ||
      !purchase_user_email ||
      !purchase_user_name ||
      !purchase_price
    ) {
      navigate("/bidpage");
      return;
    }

    const payloadObj = {
      bid_id: bid_id,
      purchase_user_email: purchase_user_email,
      purchase_user_name: purchase_user_name,
      purchase_price: purchase_price,
    };

    setGlobalLoading(true);

    let res = null;
    try {
      res = await apiCall.post(
        `apigateway/chat/submitBidForAuction`,
        payloadObj,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "OnSubmitBidButtonClick api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    }

    if (!res.data || res.data?.error) {
      toast.error(res.data?.message || "OnSubmitBidButtonClick api error", {
        autoClose: 5000,
      });
      setGlobalLoading(false);
      return;
    } else {
      const user_highest_auction_bid = res.data?.user_highest_auction_bid;
      const user_balance_amount = res.data?.balance_amount;

      setChatRoomTotalMoneySpent(
        user_highest_auction_bid || chatRoomTotalMoneySpent,
      );

      setGlobalStore((prev) => {
        return {
          ...prev,
          authpage: {
            ...prev.authpage,
            balance_amount:
              user_balance_amount === null
                ? prev.authpage?.balance_amount
                : user_balance_amount,
          },
        };
      });

      // toast.success("Api hit successful");
      setGlobalLoading(false);
      setOnUserEnterNewBid(null);
    }
  };

  // ********* end : submit new bid button click

  // *************** start : websocket functions
  const onBidPageChatRoomWebsocketConnectFunc = (bid_id) => {
    const jwtToken = globalStore.authpage?.jwtToken;

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    connectBidPageChatRoomSocket(jwtToken, onBidPageChatRoomRecieved, bid_id);
  };

  const onBidPageChatRoomRecieved = (responseObj) => {
    if (responseObj == null) return;

    setChatRoomMessagesList(responseObj.bid_chat_list || chatRoomMessagesList);

    setChatRoomPageState((prev) => {
      return {
        ...prev,
        highest_bid: responseObj.highest_auction_bid || prev.highest_bid,
      };
    });

    toast.info(responseObj.message || "Recieved a bid", {
      autoClose: 5000,
    });
  };
  // *************** end : websocket functions

  useEffect(() => {
    if (globalStore.bidPageChatRoom) {
      setChatRoomPageState({
        ...globalStore.bidPageChatRoom,
      });
      loadAllBidChats(globalStore.bidPageChatRoom?.bid_id);
      loadUserTotalSpentAmount(globalStore.bidPageChatRoom?.bid_id);
      onBidPageChatRoomWebsocketConnectFunc(
        globalStore.bidPageChatRoom?.bid_id,
      );
    } else {
      navigate("/bidPage");
      return;
    }

    const isLoggedInUserTheOwnerVar =
      globalStore.bidPageChatRoom?.sell_user_email ===
      (globalStore.authpage?.userEmail || "");
    setIsLoggedInUserTheOwner(isLoggedInUserTheOwnerVar);

    //update balance amount
    generalBalanceAmountUpdateApiCall(
      globalStore,
      setGlobalStore,
      setGlobalLoading,
      navigate,
    );

    return () => {
      disconnectBidPageChatRoomSocket();
      setGlobalStore((prev) => {
        const { bidPageChatRoom, ...rest } = prev;
        return {
          ...rest,
        };
      });
    };
  }, []);

  // ********** start : Force end bid

  const onCloseBidButtonClick = async () => {
    const jwtToken = globalStore.authpage?.jwtToken;
    const bid_id = globalStore.bidPageChatRoom?.bid_id;
    const purchase_user_email = globalStore.authpage?.userEmail;

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    if (
      bid_id === null ||
      purchase_user_email === null ||
      !bid_id ||
      !purchase_user_email
    ) {
      navigate("/bidpage");
      return;
    }

    const payloadObj = {
      bid_id: bid_id,
      user_email: purchase_user_email,
    };

    setGlobalLoading(true);

    let res = null;
    try {
      res = await apiCall.post(`apigateway/bid/toForceEndBid`, payloadObj, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "OnCloseBidButtonClick api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    }

    if (!res.data || res.data?.error) {
      toast.error(res.data?.message || "OnCloseBidButtonClick api error", {
        autoClose: 5000,
      });
      setGlobalLoading(false);
      return;
    } else {
      toast.success(res.data?.message || "Successfully closed the Bid");
      navigate("/bidpage");

      setGlobalLoading(false);
    }
  };

  // ---------- end : Force end bid

  // ********** start : when bid endTime expire , do bulk bid sell update
  let now = new Date().getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      now = new Date().getTime();

      if (
        globalStore.bidPageChatRoom?.end_date_time != null &&
        now >= globalStore.bidPageChatRoom?.end_date_time &&
        !isCurrentBidEndTimeExpired
      ) {
        setIsCurrentBidEndTimeExpired(true);
      }
    }, 1000);

    return () => clearInterval(timer); // cleanup
  }, []);

  useEffect(() => {
    if (isCurrentBidEndTimeExpired) {
      onAutomaticCloseBidInChatRoom();
    }
  }, [isCurrentBidEndTimeExpired]);

  const onAutomaticCloseBidInChatRoom = async () => {
    const jwtToken = globalStore.authpage?.jwtToken;

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    setGlobalLoading(true);

    let res = null;
    try {
      res = await apiCall.get(`apigateway/bid/bulkBidItemSell`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "OnAutomaticCloseBidInChatRoom api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    }

    if (!res.data || res.data?.error) {
      toast.error(
        res.data?.message || "OnAutomaticCloseBidInChatRoom api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    } else {
      toast.success("Successfully closed the Bid");
      navigate("/bidpage");

      setGlobalLoading(false);
    }
  };

  // ----------- end : when bid endTime expire , do bulk bid sell update

  // ****** start : extras

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatRoomMessagesList]);

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

  useEffect(() => {
    if (onUserEnterNewBid !== null) {
      const userAmountBidded = parseInt(onUserEnterNewBid);
      const itemsHighestBid = !chatRoomPageState.highest_bid
        ? 0
        : chatRoomPageState.highest_bid;

      if (userAmountBidded <= (itemsHighestBid || 0)) {
        setBidInfoErrorComponent({
          error: true,
          component: (
            <p className="chat-room-bid-error-message">
              You cannot bid amount less then item's highest bid
            </p>
          ),
        });
      } else {
        setBidInfoErrorComponent({
          error: false,
          component: (
            <p className="chat-room-bid-all-right-message">
              {chatRoomTotalMoneySpent !== 0 && (
                <>
                  Since you have already paid{" "}
                  <span className="gold-text">₹ {chatRoomTotalMoneySpent}</span>
                  ,
                  <br />
                </>
              )}
              <span className="gold-text">
                ₹ {userAmountBidded - (chatRoomTotalMoneySpent || 0)}
              </span>{" "}
              will be deducted from you wallet
            </p>
          ),
        });
      }
    } else {
      setBidInfoErrorComponent({
        error: true,
        component: <></>,
      });
    }
  }, [onUserEnterNewBid]);

  // ****** end : extras

  return (
    <>
      <YellowShaderBackground />

      <AutoLoginService
        setIsAuthenticatedFromCallingPage={setIsAuthenticatedFromCallingPage}
      />

      {isAuthenticatedFromCallingPage === true && (
        <div className="bid-page-chat-room-outer_wrapper">
          <div className="bid-page-chat-room-main-container">
            <div className="bid-page-chat-room-inner-body-wrapper">
              <div className="bid-page-chat-room-page-title-balance-container">
                <p className="bid-page-chat-room-page-title">
                  Live <span>bidding</span> room
                </p>
                <div className="bid-page-chat-room-inner-body-page-wallet-balance-section">
                  <p className="part1">Wallet Balance :</p>
                  <p className="part2">
                    ₹ {globalStore.authpage?.balance_amount || 0}
                  </p>
                </div>
              </div>

              <div className="create-bid-chat-room-middle-item-details-card-container">
                <div className="create-bid-chat-room-middle-item-details-card-container-top-section">
                  <div className="create-bid-chat-room-middle-item-details-card-left-container">
                    <p className="create-bid-chat-room-middle-item-details-card-left-container-title-text gold-text">
                      Item Details
                    </p>
                    <p className="create-bid-chat-room-middle-item-details-card-left-container-item-name">
                      <span className="text-underline">Item name</span> :{" "}
                      {chatRoomPageState?.item_name || "item name"}
                    </p>

                    <div className="create-bid-chat-room-middle-item-details-card-left-container-starting-price">
                      <span className="text-underline">Starting price</span> :{" "}
                      <span className="price">
                        {" "}
                        ₹ {chatRoomPageState?.item_price || 0}
                      </span>
                    </div>

                    <p className="create-bid-chat-room-middle-item-details-card-left-container-posted-by-name">
                      <span className="text-underline">Posted by</span> :{" "}
                      {chatRoomPageState?.sell_user_name || "owner name"}
                    </p>
                    <p className="create-bid-chat-room-middle-item-details-card-left-container-item-description">
                      <span className="text-underline">Item description</span> :{" "}
                      {chatRoomPageState?.item_description ||
                        "item description"}
                    </p>
                    <p className="create-bid-chat-room-middle-item-details-card-left-container-item-bid-id">
                      <span className="text-underline">Bid id</span> :{" "}
                      {chatRoomPageState?.bid_id || "Bid id"}
                    </p>
                  </div>
                  <div className="create-bid-chat-room-middle-item-details-card-right-container">
                    <div className="create-bid-chat-room-middle-item-details-card-right-container-image-section">
                      <img
                        src={chatRoomPageState?.item_image_url}
                        alt="item image"
                      />
                    </div>
                    <p className="create-bid-chat-room-middle-item-details-card-right-container-item-highest-bid-price">
                      <span className="text-underline">
                        Highest/Current bid
                      </span>{" "}
                      :
                      {chatRoomPageState?.highest_bid ? (
                        <span className="price gold-text">
                          ₹ {chatRoomPageState?.highest_bid || "highest bid"}
                        </span>
                      ) : (
                        <span className="no-price">No bids yet</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="create-bid-chat-room-middle-item-details-card-container-bottom-section">
                  <div className="create-bid-chat-room-middle-item-details-card-container-start-end-date-container">
                    <p className="chat-room-start-date">
                      <span className="text-underline"> Start date</span> :{" "}
                      {formatDate(chatRoomPageState?.post_date_time || 0)}
                    </p>
                    <div className="vertical-line" />
                    <p className="chat-room-end-date">
                      <span className="text-underline">End date</span> :{" "}
                      {formatDate(chatRoomPageState?.end_date_time || 0)}
                    </p>
                  </div>
                </div>
                <div className="create-bid-chat-room-middle-item-details-card-container-live-timer">
                  <div className="live-indicator">
                    <span className="live-dot"></span>
                    LIVE
                  </div>
                  <div className="vertical-line"></div>
                  <CountdownTimer
                    endTime={chatRoomPageState?.end_date_time || 0}
                  />
                </div>
              </div>

              <div className="create-bid-chat-room-page-chat-room-outer-wrapper">
                <div className="chat-room-container-top-section">
                  <p className="chat-room-container-top-section-card-title-text">
                    Bid Room
                  </p>
                  {isLoggedInUserTheOwner === false && (
                    <div className="chat-room-container-top-section-card-current-placed-bid">
                      <p className="chat-room-container-top-section-card-current-placed-bid-title gold-text">
                        Your current bid :
                      </p>
                      <p className="chat-room-container-top-section-card-current-placed-bid-value">
                        ₹ {chatRoomTotalMoneySpent}
                      </p>
                    </div>
                  )}
                </div>
                <div className="chat-room-card-horizontal-line" />
                <div className="chat-room-container-middle-section">
                  {!chatRoomMessagesList === false &&
                    chatRoomMessagesList.length !== 0 && (
                      <div
                        className="chat-room-container-middle-section-chat-list-container"
                        ref={chatContainerRef}
                      >
                        <div className="chat-room-container-middle-section-chat-list">
                          {(chatRoomMessagesList || []).map((obj, ind) => {
                            const sameBidder =
                              globalStore.authpage?.userEmail ===
                              obj.purchase_user_email;
                            return (
                              <div
                                className={`middle-section-chat-component-message-card ${sameBidder ? "right-side" : "left-side"}`}
                                key={
                                  obj.chat_id + obj.purchase_user_email + ind
                                }
                              >
                                <p className="middle-section-chat-component-message-card-price-tag">
                                  ₹ {obj.purchase_price}
                                </p>
                                <p className="middle-section-chat-component-message-card-bid-by-username">
                                  Bid by{" "}
                                  <span className="gold-text">
                                    {obj.purchase_user_name}
                                  </span>
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {!chatRoomMessagesList === false &&
                    chatRoomMessagesList.length === 0 && (
                      <div className="chat-room-container-middle-section-empty-chat-list-container">
                        <p>No bids yet</p>
                      </div>
                    )}

                  {chatRoomMessagesList === null && (
                    <div className="chat-room-container-middle-section-chat-still-loading-container">
                      <CubeSpinner />
                    </div>
                  )}
                </div>
                <div className="chat-room-card-horizontal-line" />
                <div className="chat-room-container-end-section">
                  {isLoggedInUserTheOwner === false && (
                    <>
                      <div className="chat-room-container-end-section-left-section">
                        <div className="chat-room-container-end-section-left-top-section">
                          {bidInfoErrorComponent.component}
                        </div>
                        <div className="chat-room-container-end-section-left-bottom-section">
                          <Form.Label className="chat-room-container-end-section-enter-bid-label">
                            Enter your new bid price (₹) :
                          </Form.Label>
                          <Form.Control
                            className="chat-room-container-end-section-enter-bid-input-component"
                            type="text"
                            placeholder="Enter amount (₹) ..."
                            name="chat-room-bid-money-enter-input"
                            value={onUserEnterNewBid || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (!value) {
                                setOnUserEnterNewBid(null);
                                return;
                              }
                              if (/^\d*$/.test(value)) {
                                setOnUserEnterNewBid(value);
                              }
                            }}
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      <div className="chat-room-container-end-section-right-section">
                        <RightArrowButton
                          buttonLabel="Submit bid"
                          disabled={bidInfoErrorComponent.error}
                          onClickFunction={onSubmitBidButtonClick}
                        />
                      </div>
                    </>
                  )}

                  {isLoggedInUserTheOwner && (
                    <>
                      <div className="chat-room-container-end-section-left-section">
                        <p className="chat-room-container-end-section-left-section-end-auction-text">
                          End your auction with current/hightest bid ?
                        </p>
                      </div>
                      <div className="chat-room-container-end-section-right-section">
                        <RightArrowButton
                          buttonLabel="End bid"
                          onClickFunction={onCloseBidButtonClick}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BidPageChatRoom;
