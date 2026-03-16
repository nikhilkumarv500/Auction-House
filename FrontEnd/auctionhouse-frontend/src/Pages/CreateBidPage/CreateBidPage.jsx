import React, { useEffect, useState } from "react";
import "./CreateBidPage.scss";
import GreenShaderBackground from "../../Components/Shaders/GreenShaderBackground";
import AutoLoginService from "../../Services/AutoLoginService/AutoLoginService";
import Footer from "../../Components/Footer/Footer";
import ImageUploadComponent from "../../Components/ImageUploadComponent/ImageUploadComponent";
import { Button, Form } from "react-bootstrap";
import AuctionEndDatePicker from "../../Components/AuctionEndDatePicker/AuctionEndDatePicker";
import RightArrowButton from "../../Components/RightArrowButton/RightArrowButton";
import ElectricBorder from "../../Components/ElectricBorder/ElectricBorder";
import { useStore } from "../../Config/StoreContext/StoreContext";
import apiCall from "../../Config/AxiosConfig/apiCall";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { generalBalanceAmountUpdateApiCall } from "../../lib/GeneralApiCalls";

const CreateBidPage = () => {
  const { globalStore, setGlobalStore, setGlobalLoading } = useStore();
  const navigate = useNavigate();

  const [isAuthenticatedFromCallingPage, setIsAuthenticatedFromCallingPage] =
    useState(null);

  const [item_image, setImage] = useState(null);
  const [end_date_time, setEndTime] = useState(null);

  const [createBidPageState, setCreateBidPageState] = useState({
    item_name: "",
    item_description: "",
    item_price: 0,
  });

  const onComponentsValueChage = (e) => {
    setCreateBidPageState((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  //****** start : create bid page api call

  const onCreateBidButtonClick = async () => {
    const jwtToken = globalStore.authpage?.jwtToken;
    const sell_user_email = !globalStore.authpage?.userEmail
      ? null
      : globalStore.authpage?.userEmail;

    if (
      jwtToken == null ||
      !jwtToken ||
      sell_user_email == null ||
      !sell_user_email
    ) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    setGlobalLoading(true);

    const formData = new FormData();

    formData.append("sell_user_email", sell_user_email);
    formData.append(
      "item_price",
      !createBidPageState.item_price ? null : createBidPageState.item_price,
    );
    formData.append(
      "item_description",
      !createBidPageState.item_description
        ? null
        : createBidPageState.item_description,
    );
    formData.append("end_date_time", !end_date_time ? null : end_date_time);
    formData.append("item_image", !item_image ? null : item_image);
    formData.append(
      "item_name",
      !createBidPageState.item_name ? null : createBidPageState.item_name,
    );

    let res = null;

    try {
      res = await apiCall.post("apigateway/bid/createBid", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "CreateBid api error", {
        autoClose: 5000,
      });
      setGlobalLoading(false);
      return;
    }

    if (!res.data || res.data?.error) {
      toast.error(res.data?.message || "GetActiveBids api error", {
        autoClose: 5000,
      });
      setGlobalLoading(false);
      return;
    } else {
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

      navigate("/bidpage");
      toast.success("Created new bid");
      setGlobalLoading(false);
    }
  };

  //------ end : create bid page api call

  // ******** start : load balance amoiunt on page load

  useEffect(() => {
    if (isAuthenticatedFromCallingPage) {
      //update balance amount
      generalBalanceAmountUpdateApiCall(
        globalStore,
        setGlobalStore,
        setGlobalLoading,
        navigate,
      );
    }
  }, [isAuthenticatedFromCallingPage]);
  // ------- end : load balance amoiunt on page load

  return (
    <>
      <GreenShaderBackground />

      <AutoLoginService
        setIsAuthenticatedFromCallingPage={setIsAuthenticatedFromCallingPage}
      />

      {isAuthenticatedFromCallingPage === true && (
        <div className="create-bid-page-outer_wrapper">
          <div className="create-bid-page-main-container">
            <div className="create-bid-page-inner-body-wrapper">
              <div className="create-bid-page-inner-body-page-title-section">
                <p className="create-bid-page-inner-body-page-title-text">
                  Start a <span>Bid</span>
                </p>
                <div className="create-bid-page-inner-body-page-wallet-balance-section">
                  <p className="part1">Wallet Balance :</p>
                  <p className="part2">
                    ₹ {globalStore.authpage?.balance_amount || 0}
                  </p>
                </div>
              </div>

              <ElectricBorder
                color="#ffffff"
                speed={1}
                chaos={0.12}
                thickness={2}
                style={{ borderRadius: "1rem" }}
              >
                <div className="create-bid-page-details-form-container">
                  <p className="create-bid-page-details-form-container-title">
                    Enter Item details
                  </p>
                  <p className="create-bid-page-details-form-container-money-required-text">
                    ! You must have 200 Rs in your wallet balance, to pay the
                    new bid hosting fee
                  </p>
                  <div className="create-bid-page-details-form-container-item-name-container">
                    <Form.Label className="create-bid-page-details-form-container-item-name-container-label">
                      Enter item name :
                    </Form.Label>
                    <Form.Control
                      className="create-bid-page-details-form-container-item-name-container-value"
                      type="text"
                      placeholder="Item name ..."
                      name="item_name"
                      onChange={onComponentsValueChage}
                      autoComplete="off"
                    />
                  </div>

                  <div className="create-bid-page-details-form-container-item-description-container">
                    <Form.Label className="create-bid-page-details-form-container-item-description-container-label">
                      Enter item description :
                    </Form.Label>
                    <Form.Control
                      className="create-bid-page-details-form-container-item-description-container-value"
                      as="textarea"
                      rows={3}
                      placeholder="Item description ..."
                      name="item_description"
                      onChange={onComponentsValueChage}
                    />
                  </div>

                  <div className="create-bid-page-details-form-container-item-price-container">
                    <Form.Label className="create-bid-page-details-form-container-item-price-container-label">
                      Enter item price (₹) :
                    </Form.Label>
                    <Form.Control
                      className="create-bid-page-details-form-container-item-price-container-value"
                      type="text"
                      placeholder="Item price ..."
                      name="item_price"
                      onChange={onComponentsValueChage}
                      autoComplete="off"
                    />
                  </div>

                  <div className="create-bid-page-details-form-container-item-endDate-container">
                    <Form.Label className="create-bid-page-details-form-container-item-endDate-container-label">
                      Select auction close date/time :
                    </Form.Label>
                    <AuctionEndDatePicker setEndTime={setEndTime} />
                  </div>

                  <div className="create-bid-page-details-form-container-item-imageUpload-container">
                    <Form.Label className="create-bid-page-details-form-container-item-imageUpload-container-label">
                      Upload Item image :
                    </Form.Label>
                    <ImageUploadComponent
                      className="create-bid-page-details-form-container-item-imageUpload-container-value"
                      setImage={setImage}
                    />
                  </div>

                  <div className="create-bid-page-details-form-container-item-create-bid-button-container">
                    <RightArrowButton
                      buttonLabel="Create Bid"
                      onClickFunction={onCreateBidButtonClick}
                    />
                  </div>
                </div>
              </ElectricBorder>
              <Footer />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateBidPage;
