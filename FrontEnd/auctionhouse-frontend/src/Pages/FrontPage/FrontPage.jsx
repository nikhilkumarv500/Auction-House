import React, { useEffect, useState } from "react";
import "./FrontPage.scss";
import { Button } from "react-bootstrap";
import GlareHover from "../../Components/GlareHover/GlareHover";
import { AnimatePresence, motion } from "framer-motion";
import BlurText from "../../Components/AnimatedText/BlurText";
import ElectricBorder from "../../Components/ElectricBorder/ElectricBorder";
import LoadingText from "../../Components/LoadingText/LoadingText";
import { useStore } from "../../Config/StoreContext/StoreContext";
import apiCall from "../../Config/AxiosConfig/apiCall";
import { toast } from "react-toastify";
import axios from "axios";

const FrontPage = ({ showFrontPage, setShowFrontPage }) => {
  const apiGatewayBackendUrl = import.meta.env.VITE_GATEWAY_API_BE_URL || "";
  const mainServiceBackendUrl =
    import.meta.env.VITE_MAINSERVICE_API_BE_URL || "";
  const serviceRegistoryBackendUrl =
    import.meta.env.VITE_SERVICE_REGISTORY_API_BE_URL || "";
  const inventoryServiceBackendUrl =
    import.meta.env.VITE_INVENTORY_SERVICE_API_BE_URL || "";

  const [isApigateWayServiceOn, setIsApigateWayServiceOn] = useState(false);
  const [isMainServiceServiceOn, setIsmainServiceServiceOn] = useState(false);
  const [isServiceRegistoryServiceOn, setIsServiceRegistoryServiceOn] =
    useState(false);
  const [isInventoryServiceServerOn, setIsInventoryServiceServerOn] =
    useState(false);

  const { globalStore, setGlobalStore, setGlobalLoading } = useStore();

  const [showFrontCardAfterDelay, setShowFrontCardAfterDelay] = useState(false);
  const [showLoading, setShowLoading] = useState("server-off");

  useEffect(() => {
    setTimeout(() => {
      setShowFrontCardAfterDelay(true);
    }, 1000);
  }, []);

  const onClickTurnOnServer = () => {
    setShowLoading("exit");

    setTimeout(() => {
      setShowLoading("loading");

      try {
        // ********** start: api gate way server on chk
        axios
          .get(apiGatewayBackendUrl + "/checkApigatewayAlive")
          .then((res) => {
            if (res.status != null && res.status === 200) {
              setIsApigateWayServiceOn(true);
            } else {
              toast.error(
                "There was an issue while turning on Api gate way server.",
                {
                  autoClose: 5000,
                },
              );
              setShowLoading("server-off");
            }
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message ||
                "Api-gate way server on api error",
              {
                autoClose: 5000,
              },
            );
            setShowLoading("server-off");
            return;
          });
        //--------------- end: api gate way server on chk

        // ********** start: main service server on chk
        axios
          .get(mainServiceBackendUrl + "/checkMainServiceAlive")
          .then((res) => {
            if (res.status != null && res.status === 200) {
              setIsmainServiceServiceOn(true);
            } else {
              toast.error("There was an issue while turning on Main service.", {
                autoClose: 5000,
              });
              setShowLoading("server-off");
            }
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message ||
                "Main service server on api error",
              {
                autoClose: 5000,
              },
            );
            setShowLoading("server-off");
            return;
          });
        // --------- end: main service server on chk

        // ********** start: service registory server on chk
        axios
          .get(serviceRegistoryBackendUrl + "/checkServiceRegistoryAlive")
          .then((res) => {
            if (res.status != null && res.status === 200) {
              setIsServiceRegistoryServiceOn(true);
            } else {
              toast.error(
                "There was an issue while turning on Service registory.",
                {
                  autoClose: 5000,
                },
              );
              setShowLoading("server-off");
            }
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message ||
                "Service registory server on api error",
              {
                autoClose: 5000,
              },
            );
            setShowLoading("server-off");
            return;
          });
        // --------- end: service registory server on chk

        // ********** start: Inventory service server on chk
        axios
          .get(inventoryServiceBackendUrl + "/checkInventoryServiceAlive")
          .then((res) => {
            if (res.status != null && res.status === 200) {
              setIsInventoryServiceServerOn(true);
            } else {
              toast.error(
                "There was an issue while turning on Inventory service.",
                {
                  autoClose: 5000,
                },
              );
              setShowLoading("server-off");
            }
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message ||
                "Inventory service server on api error",
              {
                autoClose: 5000,
              },
            );
            setShowLoading("server-off");
            return;
          });
        // --------- end: Inventory service server on chk
      } catch (error) {
        toast.error(error?.response?.data?.message || "Server-on api error", {
          autoClose: 5000,
        });
        setShowLoading("server-off");
        return;
      }
    }, 599);
  };

  const afterApiCallToTurnOnServer = () => {
    setShowLoading("exit");

    setTimeout(() => {
      toast.success("Servers are on now");
      setShowLoading("server-on");

      setGlobalStore({
        ...globalStore,
        authpage: {
          ...globalStore.authpage,
          serverOn: true,
        },
      });
    }, 599);
  };

  const onClickEnterApp = () => {
    setShowFrontPage(false);
    setGlobalLoading(true);
  };

  useEffect(() => {
    if (
      isApigateWayServiceOn &&
      isMainServiceServiceOn &&
      isServiceRegistoryServiceOn &&
      isInventoryServiceServerOn
    ) {
      // only remove/unbox the below setTimeout
      setTimeout(() => {
        afterApiCallToTurnOnServer();
      }, 1000);
    }
  }, [
    isApigateWayServiceOn,
    isMainServiceServiceOn,
    isServiceRegistoryServiceOn,
    isInventoryServiceServerOn,
  ]);

  return (
    <div className="auth-page-front-page-wrapper">
      {showFrontCardAfterDelay && (
        <motion.div
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <ElectricBorder
            color="#ffffff"
            speed={1}
            chaos={0.12}
            thickness={2}
            style={{ borderRadius: "1rem" }}
          >
            <div className="auth-page-front-page-main-container">
              <BlurText
                text="Welcome to Auction House"
                delay={200}
                animateBy="words"
                direction="top"
                className="auth-front-page-card-welcome-text"
              />

              <div className="auth-front-page-card-divider-line" />
              <BlurText
                text="Just a caution!... please dont use your real email or password :)"
                delay={200}
                animateBy="words"
                direction="top"
                className="auth-front-page-card-caution-text"
              />

              <div className="auth-front-page-card-divider-line" />
              <BlurText
                text="For the best UI experience, please view this website in desktop brower (not suitable for phone/small screens) and reduce your browser zoom to 75% (Ctrl-), then please refresh page. "
                delay={200}
                animateBy="words"
                direction="top"
                className="auth-front-page-card-caution-text"
              />

              <div className="auth-front-page-card-divider-line" />
              <BlurText
                text="If you would not wish to create a new account, you can use any of the below test account for login"
                delay={200}
                animateBy="words"
                direction="top"
                className="auth-front-page-card-caution-text"
              />
              <BlurText
                text="1). Email = a@gmail.com, Password = pass"
                delay={600}
                animateBy="words"
                direction="top"
                className="auth-front-page-card-caution-text"
              />
              <BlurText
                text="2). Email = b@gmail.com, Password = pass"
                delay={600}
                animateBy="words"
                direction="top"
                className="auth-front-page-card-caution-text"
              />

              <div className="auth-front-page-card-divider-line" />
              <BlurText
                text="Since i am use a free web host plan, servers will be turned off by default, if you wish to try out my website, please click the button below to turn on the servers, this may take upto 5 minutes. Thanks for understanding :)"
                delay={100}
                animateBy="words"
                direction="top"
                className="auth-front-page-card-server-on-description"
              />

              <div className="auth-front-page-card-divider-line" />

              <AnimatePresence>
                {showLoading === "server-off" && (
                  <motion.div
                    initial={{ opacity: 0, x: 200 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -200 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <div
                      className="auth-front-page-card-server-on-button-wrapper"
                      onClick={onClickTurnOnServer}
                    >
                      <GlareHover
                        glareColor="#ffffff"
                        glareOpacity={0.3}
                        glareAngle={-30}
                        glareSize={400}
                        transitionDuration={800}
                        playOnce={false}
                        className="auth-front-page-card-server-on-button"
                      >
                        <p className="auth-front-page-card-server-on-button-text">
                          Continue
                        </p>
                      </GlareHover>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showLoading === "loading" && (
                  <motion.div
                    initial={{ opacity: 0, x: 200 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -200 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <LoadingText text={"Turning on servers..."}></LoadingText>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showLoading === "server-on" && (
                  <motion.div
                    initial={{ opacity: 0, x: 200 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="auth-front-page-card-after-server-on-enter-container"
                  >
                    <p className="auth-front-page-card-after-server-on-enter-success-text">
                      Servers are on now :)
                    </p>
                    <div
                      className="auth-front-page-card-after-server-on-enter-button-wrapper"
                      onClick={onClickEnterApp}
                    >
                      <GlareHover
                        glareColor="#ffffff"
                        glareOpacity={0.3}
                        glareAngle={-30}
                        glareSize={400}
                        transitionDuration={800}
                        playOnce={false}
                        className="auth-front-page-card-after-server-on-enter-button"
                      >
                        <p className="auth-front-page-after-server-on-enter-button-text">
                          Enter !
                        </p>
                      </GlareHover>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ElectricBorder>
        </motion.div>
      )}
    </div>
  );
};

export default FrontPage;
