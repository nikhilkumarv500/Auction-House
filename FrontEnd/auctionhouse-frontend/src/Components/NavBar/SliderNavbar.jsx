import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import "./SliderNavbar.scss";
import RotatingText from "../RotatingText/RotatingText";
import { useStore } from "../../Config/StoreContext/StoreContext";
import { connectPersonalDetailsBroadcastWebsocket } from "../../WebSocketServices/PersonalDetailsBroadcastWebsocket";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import ColorExanderMotionbutton from "../ColorExanderMotionbutton/ColorExanderMotionbutton";

export default function SliderNavbar({
  items = [
    { label: "All Bids", href: "/bidpage" },
    { label: "Host Bid", href: "/createBid" },
    { label: "Wallet", href: "/wallet" },
    { label: "My Bids", href: "/myBids" },
  ],
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { globalStore, setGlobalStore, setGlobalLoading } = useStore();

  const authUserName = globalStore.authpage?.userName;

  const active = items.findIndex((item) => item.href === location.pathname);

  // *************** start : Personal details websocket functions
  const onPersonalDetailsWebsocketConnectFunc = () => {
    const jwtToken = globalStore.authpage?.jwtToken;
    const userEmail = globalStore.authpage?.userEmail;

    if (jwtToken == null || !jwtToken || userEmail == null || !userEmail) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    connectPersonalDetailsBroadcastWebsocket(
      jwtToken,
      onPersonalDetailsMessageRecieved,
      userEmail,
    );
  };

  const onPersonalDetailsMessageRecieved = (responseObj) => {
    if (responseObj == null) return;

    setGlobalStore((prev) => {
      return {
        ...prev,
        authpage: {
          ...prev.authpage,
          balance_amount:
            responseObj.balance_amount === null
              ? prev.authpage?.balance_amount || 0
              : responseObj.balance_amount,
        },
      };
    });

    toast.info(
      "Recieved live wallet balance update : ₹ " +
        (responseObj.balance_amount || 0),
      {
        autoClose: 5000,
      },
    );
  };

  useEffect(() => {
    if (globalStore.authpage?.jwtToken) onPersonalDetailsWebsocketConnectFunc();
  }, [globalStore.authpage?.userEmail]);
  // ------------ end : Personal details

  // ************* start : logout code

  const clearLocalStorage = () => {
    localStorage.removeItem("auctionHouseJwtToken");
    localStorage.removeItem("auctionHouseUserName");
    localStorage.removeItem("auctionHouseUserEmail");
  };

  const onLogoutButtonClick = () => {
    setGlobalStore({});
    clearLocalStorage();
    navigate("/");
    return;
  };

  // ------------ end : logout code

  return (
    <>
      {location.pathname != "/" && globalStore.authpage?.jwtToken && (
        <div className="slider-navbar-outer-wrapper">
          <div className="slider-navbar-main-container">
            <motion.div
              initial={{ opacity: 0, y: -200 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="slider-navbar-inner-wrapper">
                <div className="slider-navbar-welcome-user-container">
                  <RotatingText
                    texts={
                      authUserName != null
                        ? ["Welcome", "Welcome"]
                        : ["Hi there !...", "Welcome back !..."]
                    }
                    mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                    className="slider-navbar-welcome-user-text"
                  />
                  {authUserName !== null ? (
                    <span>, {" " + authUserName} !...</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="slider-navbar-right-side">
                  <div className="slider-navbar">
                    {items.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          navigate(item.href);
                        }}
                        className="nav-btn"
                      >
                        {active === i && (
                          <motion.div
                            layoutId="slider"
                            className="slider-pill"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}

                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* <Button
                    className="slider-navbar-right-side-logout-button"
                    onClick={onLogoutButtonClick}
                  >
                    Logout
                  </Button> */}
                  <ColorExanderMotionbutton
                    buttonLabel={"Logout"}
                    onClickFunction={onLogoutButtonClick}
                    className="slider-navbar-right-side-logout-button"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}
