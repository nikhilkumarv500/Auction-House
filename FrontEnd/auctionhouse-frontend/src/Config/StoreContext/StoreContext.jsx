import { createContext, useContext, useState } from "react";

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [globalStore, setGlobalStore] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  return (
    <StoreContext.Provider
      value={{
        globalStore,
        setGlobalStore,
        globalLoading,
        setGlobalLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

// custom hook (important)
export const useStore = () => useContext(StoreContext);
