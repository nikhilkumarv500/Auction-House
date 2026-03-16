import React, { useEffect, useState } from "react";
import FrontPage from "../../Pages/FrontPage/FrontPage";
import { useStore } from "../../Config/StoreContext/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../Config/AxiosConfig/apiCall";

const AutoLoginService = ({ setIsAuthenticatedFromCallingPage }) => {
  const [showFrontPage, setShowFrontPage] = useState(true);

  const { globalStore, setGlobalStore, setGlobalLoading } = useStore();

  const navigate = useNavigate();

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
      clearLocalStorage();
      navigate("/");
      setIsAuthenticatedFromCallingPage(false);
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
      clearLocalStorage();
      navigate("/");
      setIsAuthenticatedFromCallingPage(false);
      return;
    }

    if (!res.data || res.data?.error) {
      console.log(res.data?.message);
      setGlobalLoading(false);
      clearLocalStorage();
      navigate("/");
      setIsAuthenticatedFromCallingPage(false);
      return;
    } else {
      const balance_amount = await balanceAmountApi(
        localStoredJwtToken,
        localStoredUserEmail,
      );

      if (balance_amount == null) {
        setGlobalLoading(false);
        clearLocalStorage();
        navigate("/");
        setIsAuthenticatedFromCallingPage(false);
        return;
      }

      setGlobalStore((prev) => ({
        ...prev,
        authpage: {
          ...prev.authpage,
          jwtToken: localStoredJwtToken,
          userName: localStoredUserName,
          userEmail: localStoredUserEmail,
          balance_amount: balance_amount,
        },
      }));

      toast.success("Auto login successfull", {
        autoClose: 5000,
      });

      setGlobalLoading(false);

      setIsAuthenticatedFromCallingPage(true);
    }
  };

  useEffect(() => {
    if (
      (!globalStore.authpage?.jwtToken ||
        globalStore.authpage?.jwtToken == null) &&
      showFrontPage === false
    ) {
      //if token "not" present in localStore only then execute the below
      checkAutoUserLogin();
    } else if (globalStore.authpage?.jwtToken && showFrontPage === true) {
      setIsAuthenticatedFromCallingPage(true);
      setShowFrontPage(false);
    }
  }, [showFrontPage]);

  return (
    <div>
      {showFrontPage && (
        <FrontPage
          showFrontPage={showFrontPage}
          setShowFrontPage={setShowFrontPage}
        />
      )}
    </div>
  );
};

export default AutoLoginService;
