import React, { useEffect, useState } from "react";
import "./ApiTestSwagger.scss";
import { Button, Form } from "react-bootstrap";
import { useStore } from "../../Config/StoreContext/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../Config/AxiosConfig/apiCall";
import AutoLoginService from "../../Services/AutoLoginService/AutoLoginService";

const ApiTestSwagger = () => {
  const { globalStore, setGlobalStore, setGlobalLoading } = useStore();

  const navigate = useNavigate();

  const [isAuthenticatedFromCallingPage, setIsAuthenticatedFromCallingPage] =
    useState(null);

  const [localStoredJwtToken, setLocalStoredJwtToken] = useState(null);
  const [localStoredUserName, setLocalStoredUserName] = useState(null);
  const [localStoredUserEmail, setLocalStoredUserEmail] = useState(null);

  useEffect(() => {
    if (isAuthenticatedFromCallingPage) {
      setLocalStoredJwtToken(localStorage.getItem("auctionHouseJwtToken"));
      setLocalStoredUserName(localStorage.getItem("auctionHouseUserName"));
      setLocalStoredUserEmail(localStorage.getItem("auctionHouseUserEmail"));
    }
  }, [isAuthenticatedFromCallingPage]);

  const [bid_id, setBid_id] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [enteredUserEmail, setEnteredUserEmail] = useState("");

  const onDeleteEveryThingForABidId = async () => {
    const jwtToken = localStoredJwtToken;

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    setGlobalLoading(true);

    let res = null;
    try {
      res = await apiCall.delete(
        `apigateway/bid/deleteEveryThingForABidId/${bid_id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "OnDeleteEveryThingForABidId api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    }

    console.log(res.data);
    toast.success("Someting got finished", {
      autoClose: 10000,
    });

    setGlobalLoading(false);
  };

  const onDeleteOnlyTheBidItemFromBidPage = async () => {
    const jwtToken = localStoredJwtToken;

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    setGlobalLoading(true);

    let res = null;
    try {
      res = await apiCall.delete(`apigateway/bid/deleteBid/${bid_id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "OnDeleteOnlyTheBidItemFromBidPage api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    }

    console.log(res.data);
    toast.success("Someting got finished", {
      autoClose: 10000,
    });

    setGlobalLoading(false);
  };

  const onResetPasswordAsAdminButtonClick = async () => {
    const jwtToken = localStoredJwtToken;

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    setGlobalLoading(true);

    const payload = {
      user_email: enteredUserEmail,
      user_password: newPassword,
    };

    let res = null;
    try {
      res = await apiCall.post(`/admin/resetPasswordAsAdmin`, payload, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "ResetPasswordAsAdmin api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    }

    console.log(res.data);
    toast.success("Someting got finished", {
      autoClose: 10000,
    });

    setGlobalLoading(false);
  };

  return (
    <>
      <AutoLoginService
        setIsAuthenticatedFromCallingPage={setIsAuthenticatedFromCallingPage}
      />

      {isAuthenticatedFromCallingPage === true && (
        <div className="api-test-swagger-outer_wrapper">
          <div className="api-test-swagger-main-container">
            <div className="api-test-swagger-inner-body-wrapper">
              <p className="api-test-swagger-page-title">
                Only for dev "Nikhil kumar V"
              </p>
              <p>
                If u find this page, plz dont use anything from this page, u
                wont be having nessary permissions, so u cannot use it anyways,
                lol !!!!
              </p>
              <p>have ur devtools / inspect open plz...</p>

              <div className="api-test-swagger-page-deleteEveryThingForABidId-container">
                <Form.Label>
                  Enter bid id to delete all from Bid_item, Bid_amount,
                  Bid_chat, Old_bids, My_bids_history :
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter bid id"
                  name="api-test-swagger-page-bid-id-enter"
                  value={bid_id || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) {
                      setBid_id(null);
                      return;
                    }
                    if (/^\d*$/.test(value)) {
                      setBid_id(value);
                    }
                  }}
                  autoComplete="off"
                />
                <Button onClick={onDeleteEveryThingForABidId}>Continue</Button>
              </div>

              <div className="api-test-swagger-page-deleteEveryThingForABidId-container">
                <Form.Label>
                  Enter bid id to delete only in Bid_item :
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter bid id"
                  name="api-test-swagger-page-bid-id-enter"
                  value={bid_id || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) {
                      setBid_id(null);
                      return;
                    }
                    if (/^\d*$/.test(value)) {
                      setBid_id(value);
                    }
                  }}
                  autoComplete="off"
                />
                <Button onClick={onDeleteOnlyTheBidItemFromBidPage}>
                  Continue
                </Button>
              </div>

              <div className="api-test-swagger-page-resetPasswordAsAdmin-container">
                <p>Enter password to do resetPasswordAsAdmin :</p>
                <div className="horizontal-line" />
                <Form.Label>Enter Email below:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter new password"
                  name="api-test-swagger-page-new-password-enter"
                  value={enteredUserEmail || ""}
                  onChange={(e) => {
                    setEnteredUserEmail(e.target.value);
                  }}
                  autoComplete="off"
                />
                <div className="horizontal-line" />
                <Form.Label>Enter password below:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter new password"
                  name="api-test-swagger-page-new-password-enter"
                  value={newPassword || ""}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                  autoComplete="off"
                />
                <div className="horizontal-line" />
                <Button onClick={onResetPasswordAsAdminButtonClick}>
                  Continue
                </Button>
              </div>

              <Button
                onClick={() => {
                  console.log(localStoredJwtToken);
                  console.log(newPassword);
                  console.log(enteredUserEmail);
                }}
                style={{ marginBottom: "5rem" }}
              >
                ConsoleLog
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApiTestSwagger;
