import React, { useEffect, useState } from "react";
import "./WalletPage.scss";
import YellowShaderBackground from "../../Components/Shaders/YellowShaderBackground";
import AutoLoginService from "../../Services/AutoLoginService/AutoLoginService";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../Config/StoreContext/StoreContext";
import { generalBalanceAmountUpdateApiCall } from "../../lib/GeneralApiCalls";
import Footer from "../../Components/Footer/Footer";
import ElectricBorder from "../../Components/ElectricBorder/ElectricBorder";
import { Form } from "react-bootstrap";
import AnimatedPaymentButton from "../../Components/AnimatedPaymentButton/AnimatedPaymentButton";
import apiCall from "../../Config/AxiosConfig/apiCall";
import { toast } from "react-toastify";

export const WalletPage = () => {
  const [isAuthenticatedFromCallingPage, setIsAuthenticatedFromCallingPage] =
    useState(null);

  const { globalStore, setGlobalStore, setGlobalLoading } = useStore();
  const navigate = useNavigate();

  const [enteredAmount, setEnteredAmount] = useState(null);

  const onAddMoneyButtonClick = async () => {
    const jwtToken = globalStore.authpage?.jwtToken;
    const purchase_user_email = globalStore.authpage?.userEmail;

    if (!enteredAmount) {
      toast.error("Entered value should be a number", {
        autoClose: 5000,
      });
      return;
    }

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    if (purchase_user_email === null || !purchase_user_email) {
      navigate("/bidpage");
      return;
    }

    const payloadObj = {
      user_email: purchase_user_email,
      amount: Number(enteredAmount) || 0,
    };

    setGlobalLoading(true);

    let res = null;
    try {
      res = await apiCall.post(`addMoneyToWallet`, payloadObj, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "OnAddMoneyButtonClick api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    }

    if (!res.data || res.data?.error) {
      toast.error(res.data?.message || "OnAddMoneyButtonClick api error", {
        autoClose: 5000,
      });
      setGlobalLoading(false);
      return;
    } else {
      toast.success(res.data?.message || "Successfully updated wallet Balance");

      setGlobalStore((prev) => {
        return {
          ...prev,
          authpage: {
            ...prev.authpage,
            balance_amount:
              res.data?.balance_amount === null
                ? prev.authpage?.balance_amount
                : res.data?.balance_amount,
          },
        };
      });

      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticatedFromCallingPage) {
      generalBalanceAmountUpdateApiCall(
        globalStore,
        setGlobalStore,
        setGlobalLoading,
        navigate,
      );
    }
  }, [isAuthenticatedFromCallingPage]);

  return (
    <>
      <YellowShaderBackground />

      <AutoLoginService
        setIsAuthenticatedFromCallingPage={setIsAuthenticatedFromCallingPage}
      />

      {isAuthenticatedFromCallingPage === true && (
        <div className="wallet-page-outer_wrapper">
          <div className="wallet-page-main-container">
            <div className="wallet-page-inner-body-wrapper">
              <div className="wallet-page-inner-body-contents-section">
                <div className="wallet-page-top-section">
                  <p className="wallet-page-heading-text">
                    Your <span>Wallet</span>
                  </p>

                  <div className="wallet-page-top-right-money-balance-section">
                    <p className="part1">Wallet Balance :</p>
                    <p className="part2">
                      ₹ {globalStore.authpage?.balance_amount || 0}
                    </p>
                  </div>
                </div>

                <div className="wallet-page-middle-section">
                  <ElectricBorder
                    color="#ffffff"
                    speed={1}
                    chaos={0.12}
                    thickness={2}
                    style={{ borderRadius: "1rem" }}
                  >
                    <div className="wallet-page-add-money-card">
                      <p className="add-money-card-title-text">
                        Add money to wallet
                      </p>

                      <p className="add-money-card-title-limit-caution-text">
                        <span>
                          ! You are not allowed add more then 5000 Rs at once
                          ...
                        </span>
                      </p>

                      <div className="wallet-page-horizontal-line" />

                      <div className="add-money-card-money-entry-form">
                        <Form.Label className="add-money-card-money-entry-form-title">
                          Enter amount :
                        </Form.Label>
                        <Form.Control
                          className="add-money-card-money-entry-form-value"
                          type="text"
                          placeholder="Enter amount ..."
                          name="amount"
                          value={enteredAmount || ""}
                          autoComplete="off"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!value) {
                              setEnteredAmount(null);
                              return;
                            }
                            if (/^\d*$/.test(value)) {
                              setEnteredAmount(value);
                            }
                          }}
                        />
                      </div>

                      <div className="wallet-page-horizontal-line" />

                      <div className="add-money-card-submit-add-money-button-section">
                        <AnimatedPaymentButton
                          buttonLabel={"Continue"}
                          onClick={onAddMoneyButtonClick}
                        />
                      </div>
                    </div>
                  </ElectricBorder>
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
