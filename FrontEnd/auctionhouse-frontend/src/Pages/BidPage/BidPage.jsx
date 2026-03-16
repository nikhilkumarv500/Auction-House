import "./BidPage.scss";
import Button from "react-bootstrap/Button";
import BlueShaderBackground from "../../Components/Shaders/BlueShaderBackground";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import apiCall from "../../Config/AxiosConfig/apiCall";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../Config/StoreContext/StoreContext";
import { toast } from "react-toastify";
import FrontPage from "../FrontPage/FrontPage";
import PurpleExpanderButton from "../../Components/PurpleExpanderButton/PurpleExpanderButton";
import AutoLoginService from "../../Services/AutoLoginService/AutoLoginService";
import CosmicSearchBar from "../../Components/CosmicSearchBar/CosmicSearchBar";
import SpotlightCard from "../../Components/SpolightCard/SpotlightCard";
import BidItemsCard from "../../Components/BidItemsCard/BidItemsCard";
import OldBidsItemsCard from "../../Components/OldBidsItemsCard/OldBidsItemsCard";
import Footer from "../../Components/Footer/Footer";
import {
  connectGeneralUpdateSocket,
  disconnectGeneralUpdateSocket,
} from "../../WebSocketServices/BidPageGeneralUpdateWebsocket";
import { generalBalanceAmountUpdateApiCall } from "../../lib/GeneralApiCalls";

function BidPage() {
  const { globalStore, setGlobalStore, setGlobalLoading } = useStore();

  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");

  const [isAuthenticatedFromCallingPage, setIsAuthenticatedFromCallingPage] =
    useState(null);

  const [bidPageState, setBidPageState] = useState({
    displayAuctionList: [],
    liveAuctionMode: true,
    liveAuctionList: [],
    oldAuctionList: [],
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
  });

  //************* start : on load active bids list

  const onLoadActiveBidsList = async () => {
    const jwtToken = globalStore.authpage?.jwtToken;

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    setGlobalLoading(true);

    let res = null;
    try {
      res = await apiCall.get("apigateway/bid/getActiveBids", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "GetActiveBids api error", {
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
      const liveAuctionList = res.data?.bit_items_list || [];

      setBidPageState((prev) => ({
        ...prev,
        displayAuctionList: liveAuctionList,
        liveAuctionMode: true,
        liveAuctionList: liveAuctionList,
        oldAuctionList: prev.oldAuctionList,
      }));

      setPagination({
        currentPage: 1,
        itemsPerPage: 5,
      });

      toast.success("Fetched active bids");
      setGlobalLoading(false);
    }
  };

  //-------------- end : on load active bids list

  //************* start : on load old bids list

  const onLoadOldBidsList = async () => {
    const jwtToken = globalStore.authpage?.jwtToken;

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    setGlobalLoading(true);

    let res = null;
    try {
      res = await apiCall.get("apigateway/bid/getAllOldBidsList", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "GetAllOldBidsList api error",
        {
          autoClose: 5000,
        },
      );
      setGlobalLoading(false);
      return;
    }

    if (!res.data || res.data?.error) {
      toast.error(res.data?.message || "GetAllOldBidsList api error", {
        autoClose: 5000,
      });
      setGlobalLoading(false);
      return;
    } else {
      const oldAuctionList = res.data?.old_bid_items_list || [];

      setBidPageState((prev) => ({
        ...prev,
        displayAuctionList: oldAuctionList,
        liveAuctionMode: false,
        liveAuctionList: prev.liveAuctionList,
        oldAuctionList: oldAuctionList,
      }));

      setPagination({
        currentPage: 1,
        itemsPerPage: 5,
      });

      toast.success("Fetched old bids");
      setGlobalLoading(false);
    }
  };

  //-------------- end : on load old bids list

  // *************** start : websocket functions
  const onGeneralUpdateWebsocketConnectFunc = () => {
    const jwtToken = globalStore.authpage?.jwtToken;

    if (jwtToken == null || !jwtToken) {
      navigate("/");
      setGlobalStore({});
      return;
    }

    connectGeneralUpdateSocket(jwtToken, onGeneralUpdateRecieved);
  };

  const onGeneralUpdateRecieved = (responseObj) => {
    if (responseObj == null) return;

    setBidPageState((prev) => {
      return {
        ...prev,
        liveAuctionList: responseObj.activeBidItemList,
        oldAuctionList: responseObj.oldBidItemList,
        displayAuctionList: prev.liveAuctionMode
          ? responseObj.activeBidItemList
          : responseObj.oldBidItemList,
      };
    });

    setPagination({
      currentPage: 1,
      itemsPerPage: 5,
    });

    toast.success("Recieved a live update", {
      autoClose: 5000,
    });
  };
  // *************** end : websocket functions

  useEffect(() => {
    if (isAuthenticatedFromCallingPage === true) {
      if (bidPageState.liveAuctionMode) onLoadActiveBidsList();
      else onLoadOldBidsList();

      generalBalanceAmountUpdateApiCall(
        globalStore,
        setGlobalStore,
        setGlobalLoading,
        navigate,
      );
      onGeneralUpdateWebsocketConnectFunc();
    }

    return () => {
      disconnectGeneralUpdateSocket();
    };
  }, [isAuthenticatedFromCallingPage]);

  const onBidPageModeChangeButtonClick = (liveButton) => {
    if (liveButton) onLoadActiveBidsList();
    else onLoadOldBidsList();

    generalBalanceAmountUpdateApiCall(
      globalStore,
      setGlobalStore,
      setGlobalLoading,
      navigate,
    );
  };

  const onSearchButtonClick = () => {
    let searchResults = bidPageState.displayAuctionList;

    if (bidPageState.liveAuctionMode === true) {
      searchResults = (bidPageState.liveAuctionList || []).filter((obj) => {
        return obj.item_name?.toLowerCase().includes(searchText.toLowerCase());
      });
    } else {
      searchResults = (bidPageState.oldAuctionList || []).filter((obj) => {
        return obj.item_name?.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    setBidPageState((prev) => ({
      ...prev,
      displayAuctionList: searchResults,
    }));

    setPagination({
      currentPage: 1,
      itemsPerPage: 5,
    });
  };

  const onSearchClearCall = () => {
    if (bidPageState.liveAuctionMode === true) {
      setBidPageState((prev) => ({
        ...prev,
        displayAuctionList: prev.liveAuctionList,
      }));
    } else {
      setBidPageState((prev) => ({
        ...prev,
        displayAuctionList: prev.oldAuctionList,
      }));
    }

    setPagination({
      currentPage: 1,
      itemsPerPage: 5,
    });
  };

  // ********** start : pagination logic

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;

  const endIndex = startIndex + pagination.itemsPerPage;

  const paginatedAuctionList =
    bidPageState.displayAuctionList?.slice(startIndex, endIndex) || [];

  const totalPages =
    Math.ceil(
      (bidPageState.displayAuctionList?.length || 0) / pagination.itemsPerPage,
    ) || 1;

  // ********** end : pagination logic
  return (
    <>
      <BlueShaderBackground />

      <AutoLoginService
        setIsAuthenticatedFromCallingPage={setIsAuthenticatedFromCallingPage}
      />

      {isAuthenticatedFromCallingPage === true && (
        <div className="bidpage-outer_wrapper">
          <div className="bidpage-main-container">
            <div className="bidpage-inner-body-wrapper">
              <div className="bidpage-inner-body-middle-section">
                <p className="bidpage-inner-body-auction-discovery-text">
                  Auction <span>Discovery</span>
                </p>

                <div className="bidpage-live-notlive-outer-wrapper">
                  <PurpleExpanderButton
                    className="bidpage-live-button"
                    onClick={() => {
                      onBidPageModeChangeButtonClick(true);
                    }}
                    onSelected={bidPageState.liveAuctionMode === true}
                  >
                    Live Auctions
                  </PurpleExpanderButton>
                  <PurpleExpanderButton
                    className="bidpage-notlive-button"
                    onClick={() => {
                      onBidPageModeChangeButtonClick(false);
                    }}
                    onSelected={bidPageState.liveAuctionMode === false}
                  >
                    Old Auctions
                  </PurpleExpanderButton>
                </div>

                <div className="bid-page-cosmic-search-bar-outer-wrapper">
                  <CosmicSearchBar
                    setSearchText={setSearchText}
                    searchText={searchText}
                    onSearchButtonClick={onSearchButtonClick}
                    seachPlaceholder="Search by auction item name ..."
                    onSearchClearCall={onSearchClearCall}
                  />
                </div>

                <div className="bid-page-bid-list-display-outer-wrapper">
                  {bidPageState.liveAuctionMode &&
                    paginatedAuctionList &&
                    paginatedAuctionList.length !== 0 && (
                      <div className="bid-page-bid-list-individual-componenet-lists">
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
                            />
                          );
                        })}
                      </div>
                    )}
                  {!bidPageState.liveAuctionMode &&
                    paginatedAuctionList &&
                    paginatedAuctionList.length !== 0 && (
                      <div className="bid-page-bid-list-individual-componenet-lists">
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
                  {(!paginatedAuctionList ||
                    paginatedAuctionList.length === 0) && (
                    <div className="bid-page-bid-list-empty-message-wrapper">
                      <p>No bids available</p>
                    </div>
                  )}
                </div>

                <div className="bid-page-pagination-wrapper">
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
}

export default BidPage;
