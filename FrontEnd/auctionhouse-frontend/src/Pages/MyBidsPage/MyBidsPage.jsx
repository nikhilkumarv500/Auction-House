import React, { useEffect, useState } from "react";
import "./MyBidsPage.scss";
import { useStore } from "../../Config/StoreContext/StoreContext";
import { useNavigate } from "react-router-dom";
import AutoLoginService from "../../Services/AutoLoginService/AutoLoginService";
import PurpleShaderBackground from "../../Components/Shaders/PurpleShaderBackground";
import PurpleExpanderButton from "../../Components/PurpleExpanderButton/PurpleExpanderButton";
import Footer from "../../Components/Footer/Footer";
import { Button, Form } from "react-bootstrap";
import CosmicSearchBar from "../../Components/CosmicSearchBar/CosmicSearchBar";
import { generalBalanceAmountUpdateApiCall } from "../../lib/GeneralApiCalls";
import BidItemsCard from "../../Components/BidItemsCard/BidItemsCard";
import OldBidsItemsCard from "../../Components/OldBidsItemsCard/OldBidsItemsCard";
import apiCall from "../../Config/AxiosConfig/apiCall";
import { toast } from "react-toastify";
import WonLostBidItemCard from "../../Components/WonLostBidItemCard/WonLostBidItemCard";

const MyBidsPage = () => {
  const { globalStore, setGlobalStore, setGlobalLoading } = useStore();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
  });

  const [searchText, setSearchText] = useState("");

  const [isAuthenticatedFromCallingPage, setIsAuthenticatedFromCallingPage] =
    useState(null);

  const [myBidDisplayListState, setMyBidDisplayListState] = useState({
    fullList: [],
    displayList: [],
  });

  // live, old, won, lost
  const [myBidPageModeSelect, setMyBidPageModeSelect] = useState("live");

  const onDisplayListLoadApiCallAndModeChange = async (mode) => {
    const jwtToken = globalStore.authpage?.jwtToken;
    const purchase_user_email = globalStore.authpage?.userEmail;

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
    };

    setGlobalLoading(true);

    let res = null;
    try {
      res = await apiCall.post(
        `apigateway/bid/getMyBidsList/${mode}`,
        payloadObj,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "OnDisplayListLoadApiCallAndModeChange api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    }

    if (!res.data || res.data?.error) {
      toast.error(
        res.data?.message || "OnDisplayListLoadApiCallAndModeChange api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    } else {
      toast.success(res.data?.message || "Successfully fetched bid list");

      setMyBidDisplayListState({
        fullList: res.data?.fullDisplayList,
        displayList: res.data?.fullDisplayList,
      });

      setMyBidPageModeSelect(mode);

      setPagination({
        currentPage: 1,
        itemsPerPage: 5,
      });
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticatedFromCallingPage) {
      onDisplayListLoadApiCallAndModeChange("live");

      //update balance amount
      generalBalanceAmountUpdateApiCall(
        globalStore,
        setGlobalStore,
        setGlobalLoading,
        navigate,
      );
    }
  }, [isAuthenticatedFromCallingPage]);

  // ********** start : pagination logic

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;

  const endIndex = startIndex + pagination.itemsPerPage;

  const paginatedAuctionList =
    myBidDisplayListState.displayList?.slice(startIndex, endIndex) || [];

  const totalPages =
    Math.ceil(
      (myBidDisplayListState.displayList?.length || 0) /
        pagination.itemsPerPage,
    ) || 1;

  // --------- end : pagination logic

  // ******** start : search bar logic

  const onSearchButtonClick = () => {
    let searchResults = myBidDisplayListState.fullList;

    searchResults = (myBidDisplayListState.fullList || []).filter((obj) => {
      return obj.item_name?.toLowerCase().includes(searchText.toLowerCase());
    });

    setMyBidDisplayListState((prev) => ({
      ...prev,
      displayList: searchResults,
    }));

    setPagination({
      currentPage: 1,
      itemsPerPage: 5,
    });
  };

  const onSearchClearCall = () => {
    setMyBidDisplayListState((prev) => ({
      ...prev,
      displayList: myBidDisplayListState.fullList,
    }));

    setPagination({
      currentPage: 1,
      itemsPerPage: 5,
    });
  };

  // -------- end : search bar logic

  return (
    <>
      <PurpleShaderBackground />

      <AutoLoginService
        setIsAuthenticatedFromCallingPage={setIsAuthenticatedFromCallingPage}
      />

      {isAuthenticatedFromCallingPage === true && (
        <div className="my-bid-page-outer_wrapper">
          <div className="my-bid-page-main-container">
            <div className="my-bid-page-inner-body-wrapper">
              <div className="my-bid-page-inner-body-contents-section">
                <p className="my-bid-page-inner-body-wrapper-page-heading">
                  My Bids <span>History</span>
                </p>

                <div className="my-bid-page-mode-decide-button">
                  <PurpleExpanderButton
                    className="my-bid-live-auction-button"
                    onClick={() => {
                      onDisplayListLoadApiCallAndModeChange("live");
                    }}
                    onSelected={myBidPageModeSelect === "live"}
                  >
                    Live Auctions
                  </PurpleExpanderButton>
                  <PurpleExpanderButton
                    className="my-bid-old-auction-button"
                    onClick={() => {
                      onDisplayListLoadApiCallAndModeChange("old");
                    }}
                    onSelected={myBidPageModeSelect === "old"}
                  >
                    Old Auctions
                  </PurpleExpanderButton>
                  <PurpleExpanderButton
                    className="my-bid-won-auction-button"
                    onClick={() => {
                      onDisplayListLoadApiCallAndModeChange("won");
                    }}
                    onSelected={myBidPageModeSelect === "won"}
                  >
                    Auctions Won
                  </PurpleExpanderButton>
                  <PurpleExpanderButton
                    className="my-bid-lost-auction-button"
                    onClick={() => {
                      onDisplayListLoadApiCallAndModeChange("lost");
                    }}
                    onSelected={myBidPageModeSelect === "lost"}
                  >
                    Auctions Lost
                  </PurpleExpanderButton>
                </div>

                <div className="my-bid-page-cosmic-search-bar-outer-wrapper">
                  <CosmicSearchBar
                    setSearchText={setSearchText}
                    searchText={searchText}
                    onSearchButtonClick={onSearchButtonClick}
                    seachPlaceholder="Search by auction item name ..."
                    onSearchClearCall={onSearchClearCall}
                  />
                </div>

                <div className="my-bid-page-bid-list-display-outer-wrapper">
                  {myBidPageModeSelect === "live" &&
                    paginatedAuctionList &&
                    paginatedAuctionList.length !== 0 && (
                      <div className="my-bid-page-bid-list-individual-componenet-lists">
                        {paginatedAuctionList.map((obj) => {
                          return (
                            <BidItemsCard
                              itemDataObj={obj}
                              key={
                                (obj.post_date_time || 0) +
                                (obj.end_date_time || 0) +
                                (obj.highest_bid || 0) +
                                obj.item_name
                              }
                              onDoWhenBidExpire={() => {
                                onDisplayListLoadApiCallAndModeChange(
                                  myBidPageModeSelect,
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                    )}
                  {myBidPageModeSelect === "old" &&
                    paginatedAuctionList &&
                    paginatedAuctionList.length !== 0 && (
                      <div className="my-bid-page-bid-list-individual-componenet-lists">
                        {paginatedAuctionList.map((obj, ind) => {
                          return (
                            <OldBidsItemsCard
                              itemDataObj={obj}
                              key={
                                (obj.bid_start_date_time || 1) +
                                (obj.bid_end_date_time || 2) +
                                (obj.highest_bid || 0) +
                                obj.item_name
                              }
                            />
                          );
                        })}
                      </div>
                    )}
                  {myBidPageModeSelect === "won" &&
                    paginatedAuctionList &&
                    paginatedAuctionList.length !== 0 && (
                      <div className="my-bid-page-bid-list-individual-componenet-lists">
                        {paginatedAuctionList.map((obj, ind) => {
                          return (
                            <WonLostBidItemCard
                              itemDataObj={obj}
                              key={
                                (obj.bid_start_date_time || 1) +
                                (obj.bid_end_date_time || 2) +
                                (obj.highest_bid || 0) +
                                obj.item_name
                              }
                            />
                          );
                        })}
                      </div>
                    )}
                  {myBidPageModeSelect === "lost" &&
                    paginatedAuctionList &&
                    paginatedAuctionList.length !== 0 && (
                      <div className="my-bid-page-bid-list-individual-componenet-lists">
                        {paginatedAuctionList.map((obj, ind) => {
                          return (
                            <WonLostBidItemCard
                              itemDataObj={obj}
                              key={
                                (obj.bid_start_date_time || 1) +
                                (obj.bid_end_date_time || 2) +
                                (obj.highest_bid || 0) +
                                obj.item_name
                              }
                            />
                          );
                        })}
                      </div>
                    )}
                  {(!paginatedAuctionList ||
                    paginatedAuctionList.length === 0) && (
                    <div className="my-bid-page-bid-list-empty-message-wrapper">
                      <p>No bids available</p>
                    </div>
                  )}
                </div>

                <div className="my-bid-page-pagination-wrapper">
                  <div className="pagination-size">
                    <span>Items per page: </span>

                    <Form.Select
                      value={pagination.itemsPerPage}
                      onChange={(e) => {
                        setPagination({
                          currentPage: 1,
                          itemsPerPage: Number(e.target.value),
                        });
                      }}
                      style={{ width: "100px", display: "inline-block" }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </Form.Select>
                  </div>

                  <div className="pagination-buttons">
                    <Button
                      disabled={pagination.currentPage === 1}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: prev.currentPage - 1,
                        }))
                      }
                    >
                      Prev
                    </Button>

                    <span style={{ margin: "0 15px" }}>
                      Page {pagination.currentPage} of {totalPages || 1}
                    </span>

                    <Button
                      disabled={pagination.currentPage === totalPages}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: prev.currentPage + 1,
                        }))
                      }
                    >
                      Next
                    </Button>
                  </div>
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

export default MyBidsPage;
