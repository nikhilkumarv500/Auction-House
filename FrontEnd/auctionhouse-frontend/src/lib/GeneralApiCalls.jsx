import { toast } from "react-toastify";
import apiCall from "../Config/AxiosConfig/apiCall";

// ******** start : load balance amoiunt on page load
export const generalBalanceAmountUpdateApiCall = async (
  globalStore,
  setGlobalStore,
  setGlobalLoading,
  navigate,
) => {
  const jwtToken = globalStore.authpage?.jwtToken;
  const sell_user_email = globalStore.authpage?.userEmail;

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

  let res = null;

  const balanceRequestPayload = {
    email: sell_user_email,
  };

  try {
    res = await apiCall.post("/getBankBalance", balanceRequestPayload, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
  } catch (error) {
    toast.error(
      res.data?.message || "BalanceAmountApi api error | Please reload page",
      {
        autoClose: 5000,
      },
    );
    setGlobalLoading(false);
    return;
  }

  if (!res.data || res.data?.error) {
    toast.error(
      res.data?.message || "BalanceAmountApi api error | Please reload page",
      {
        autoClose: 5000,
      },
    );
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

    setGlobalLoading(false);
    return res.data?.balance_amount;
  }
};
