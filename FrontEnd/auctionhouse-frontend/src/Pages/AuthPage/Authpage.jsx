import "./Authpage.scss";
import Button from "react-bootstrap/Button";
import OrangeSharderBackground from "../../Components/Shaders/OrangeSharderBackground";
import { motion } from "framer-motion";
import BlurText from "../../Components/AnimatedText/BlurText";
import TiltedCard from "../../Components/TiltedCard/TiltedCard";
import ElectricBorder from "../../Components/ElectricBorder/ElectricBorder";
import Form from "react-bootstrap/Form";
import TargetCursor from "../../Components/TargetCursor/TargetCursor";
import GlareHover from "../../Components/GlareHover/GlareHover";
import { useEffect, useState } from "react";
import apiCall from "../../Config/AxiosConfig/apiCall";
import FrontPage from "../FrontPage/FrontPage";
import { useStore } from "../../Config/StoreContext/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const { globalStore, setGlobalStore, setGlobalLoading } = useStore();

  const navigate = useNavigate();

  const [authState, setAuthState] = useState({
    loginMode: true,
    authUserName: "",
    authUserEmail: "",
    authUserPassword: "",
  });

  const [showFrontPage, setShowFrontPage] = useState(true);
  const [isLocalUserAutheticated, setIsLocalUserAutheticated] = useState(true);

  const changeAuthMode = () => {
    setAuthState({
      ...authState,
      loginMode: !authState.loginMode,
      authUserName: "",
      authUserEmail: "",
      authUserPassword: "",
    });
  };

  const onTextChange = (e) => {
    setAuthState({
      ...authState,
      [e.target.name]: e.target.value,
    });
  };

  const onClickContinue = async () => {
    //----------------register
    if (authState.loginMode === false) {
      const registerPayload = {
        email: authState.authUserEmail,
        name: authState.authUserName,
        password: authState.authUserPassword,
      };

      let res = {};
      try {
        setGlobalLoading(true);
        res = await apiCall.post("/register", registerPayload);
      } catch (error) {
        setGlobalLoading(false);
        toast.error(error?.response?.data || "Register api error", {
          autoClose: 5000,
        });
        return;
      }

      if (!res.data || res.data?.error) {
        setGlobalLoading(false);
        toast.error(res.data?.message || "Register api error", {
          autoClose: 5000,
        });
        return;
      } else {
        toast.success("Registration successfull");
        setAuthState({
          ...authState,
          loginMode: true,
          authUserName: "",
          authUserEmail: "",
          authUserPassword: "",
        });
        setGlobalLoading(false);
      }
    }
    //----------------login
    else if (authState.loginMode === true) {
      const loginPayload = {
        email: authState.authUserEmail,
        password: authState.authUserPassword,
      };

      let res = {};
      try {
        setGlobalLoading(true);
        res = await apiCall.post("/login", loginPayload);
      } catch (error) {
        toast.error(error?.response?.data || "Login api error", {
          autoClose: 5000,
        });
        setGlobalLoading(false);
        return;
      }

      if (!res.data || res.data?.error) {
        toast.error(res.data?.message || "Login api error", {
          autoClose: 5000,
        });
        setGlobalLoading(false);
        return;
      } else {
        setGlobalStore({
          ...globalStore,
          authpage: {
            ...globalStore.authpage,
            jwtToken: res.data?.jwtToken,
            userName: res.data?.name,
            userEmail: res.data?.email,
            balance_amount: res.data?.balance_amount,
          },
        });

        localStorage.setItem("auctionHouseJwtToken", res.data?.jwtToken);
        localStorage.setItem("auctionHouseUserEmail", authState.authUserEmail);
        localStorage.setItem("auctionHouseUserName", res.data?.name);

        setAuthState({
          ...authState,
          loginMode: true,
          authUserName: "",
          authUserEmail: "",
          authUserPassword: "",
        });

        toast.success("Login Successful", {
          autoClose: 5000,
        });

        setGlobalLoading(false);

        navigate("/bidpage");
      }
    }
  };

  //----------------------------------------------auto auth : start
  const clearLocalStorage = () => {
    localStorage.removeItem("auctionHouseJwtToken");
    localStorage.removeItem("auctionHouseUserName");
    localStorage.removeItem("auctionHouseUserEmail");
  };

  const balanceAmountApi = async (localStoredJwtToken, userEmail) => {
    let res = null;

    const balanceRequestPayload = {
      email: userEmail,
    };

    try {
      res = await apiCall.post("/getBankBalance", balanceRequestPayload, {
        headers: {
          Authorization: `Bearer ${localStoredJwtToken}`,
        },
      });
    } catch (error) {
      console.log(error?.response?.data?.message);
      return null;
    }

    if (!res.data || res.data?.error) {
      return null;
    } else {
      return res.data?.balance_amount;
    }
  };

  const checkAutoUserLogin = async () => {
    let res = null;
    const localStoredJwtToken = localStorage.getItem("auctionHouseJwtToken");
    const localStoredUserName = localStorage.getItem("auctionHouseUserName");
    const localStoredUserEmail = localStorage.getItem("auctionHouseUserEmail");

    if (!localStoredJwtToken || !localStoredUserName || !localStoredUserEmail) {
      setGlobalLoading(false);
      setIsLocalUserAutheticated(false);
      clearLocalStorage();
      return;
    }

    try {
      res = await apiCall.get("/checkjwt", {
        headers: {
          Authorization: `Bearer ${localStoredJwtToken}`,
        },
      });
    } catch (error) {
      console.log(error?.response?.data?.message);
      setGlobalLoading(false);
      setIsLocalUserAutheticated(false);
      clearLocalStorage();
      return;
    }

    if (!res.data || res.data?.error) {
      setIsLocalUserAutheticated(false);
      setGlobalLoading(false);
      clearLocalStorage();
      return;
    } else {
      const balance_amount = await balanceAmountApi(
        localStoredJwtToken,
        localStoredUserEmail,
      );

      if (balance_amount == null) {
        setIsLocalUserAutheticated(false);
        setGlobalLoading(false);
        clearLocalStorage();
        return;
      }

      setGlobalStore({
        ...globalStore,
        authpage: {
          ...globalStore.authpage,
          jwtToken: localStoredJwtToken,
          userName: localStoredUserName,
          userEmail: localStoredUserEmail,
          balance_amount: balance_amount,
        },
      });

      toast.success("Auto login successfull", {
        autoClose: 5000,
      });

      setGlobalLoading(false);

      navigate("/bidpage");
    }
  };

  useEffect(() => {
    if (showFrontPage === false) {
      checkAutoUserLogin();
    }
  }, [showFrontPage]);

  //----------------------------------------------auto auth : end

  return (
    <>
      <OrangeSharderBackground />

      {showFrontPage && (
        <FrontPage
          showFrontPage={showFrontPage}
          setShowFrontPage={setShowFrontPage}
        />
      )}

      {!showFrontPage && !isLocalUserAutheticated && (
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
          hoverDuration={0.2}
        />
      )}

      {!showFrontPage && !isLocalUserAutheticated && (
        <div className="authpage-outer-page-wrapper">
          <div className="authpage-main-container">
            <div className="authpage-main-container-left-side">
              <motion.div
                initial={{ opacity: 0, y: -200 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="authpage-tiltedcard-login">
                  <TiltedCard
                    containerHeight="450px"
                    containerWidth="400px"
                    rotateAmplitude={12}
                    scaleOnHover={1.05}
                    showMobileWarning={false}
                    showTooltip
                    displayOverlayContent
                    overlayContent={
                      <div className="authpage-tiltedcard-inner-login-card">
                        <div className="login-card-heading-section">
                          <img
                            src="AuctionHouse_logo.png"
                            alt="logo"
                            className="login-card-logo"
                          />
                          <p className="login-card-heading">
                            {authState.loginMode ? "Login" : "Register"}
                          </p>
                        </div>

                        {!authState.loginMode && (
                          <div className="cursor-target login-card-name-wrapper">
                            <Form.Control
                              type="text"
                              id="authpage-tiltedcard-inner-login-card-name-field"
                              placeholder="Name..."
                              className="login-card-name-text"
                              name="authUserName"
                              value={authState.authUserName}
                              onChange={onTextChange}
                            />
                          </div>
                        )}

                        <div className="cursor-target login-card-email-text-wrapper">
                          <Form.Control
                            type="text"
                            id="authpage-tiltedcard-inner-login-card-email-field"
                            placeholder="Email..."
                            className="login-card-email-text"
                            name="authUserEmail"
                            value={authState.authUserEmail}
                            onChange={onTextChange}
                          />
                        </div>

                        <div className="cursor-target login-card-password-wrapper">
                          <Form.Control
                            type="text"
                            id="authpage-tiltedcard-inner-login-card-password-field"
                            placeholder="Password..."
                            className="login-card-password-text"
                            name="authUserPassword"
                            value={authState.authUserPassword}
                            onChange={onTextChange}
                          />
                        </div>

                        <div
                          className="cursor-target login-card-action-button-wrapper"
                          onClick={onClickContinue}
                        >
                          <GlareHover
                            glareColor="#ffffff"
                            glareOpacity={0.3}
                            glareAngle={-30}
                            glareSize={400}
                            transitionDuration={800}
                            playOnce={false}
                            className="login-card-action-button"
                          >
                            <p className="login-card-action-button-text">
                              Continue
                            </p>
                          </GlareHover>
                        </div>

                        {authState.loginMode && (
                          <div className="auth-card-register-wrapper">
                            <p className="auth-card-register-description">
                              New user ?...
                            </p>
                            <p
                              className="cursor-target auth-card-register-link"
                              onClick={changeAuthMode}
                            >
                              Register
                            </p>
                          </div>
                        )}

                        {!authState.loginMode && (
                          <div className="auth-card-login-wrapper">
                            <p className="auth-card-login-description">
                              Existing user ?...
                            </p>
                            <p
                              className="cursor-target auth-card-login-link"
                              onClick={changeAuthMode}
                            >
                              Login
                            </p>
                          </div>
                        )}
                      </div>
                    }
                  />
                </div>
              </motion.div>
            </div>

            {/* right side */}
            <ElectricBorder
              color="#ffffff"
              speed={1}
              chaos={0.12}
              thickness={2}
              style={{ borderRadius: "2rem" }}
            >
              <div className="authpage-main-container-right-side">
                <BlurText
                  text="Auction House"
                  delay={200}
                  animateBy="words"
                  direction="top"
                  className="blurtext-auctionhouse-heading"
                />
                <BlurText
                  text="Step in, bid fast, win big! Your next auction adventure starts here."
                  delay={200}
                  animateBy="words"
                  direction="top"
                  className="blurtext-auctionhouse-description"
                />
              </div>
            </ElectricBorder>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthPage;
