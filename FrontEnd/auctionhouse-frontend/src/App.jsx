import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import "./AppCss.scss";
import Button from "react-bootstrap/Button";
import { Route, Routes } from "react-router-dom";
import SliderNavbar from "./Components/NavBar/SliderNavbar";
import BidPage from "./Pages/BidPage/BidPage";
import AuthPage from "./Pages/AuthPage/Authpage";
import { ToastContainer } from "react-toastify";
import LoadingScreen from "./Components/LoadingScreen/LoadingScreen";
import { useStore } from "./Config/StoreContext/StoreContext";
import CreateBidPage from "./Pages/CreateBidPage/CreateBidPage";
import BidPageChatRoom from "./Pages/BidPageChatRoom/BidPageChatRoom";
import ApiTestSwagger from "./Pages/ApiTestSwagger/ApiTestSwagger";
import MyBidsPage from "./Pages/MyBidsPage/MyBidsPage";
import { WalletPage } from "./Pages/WalletPage/WalletPage";

function App() {
  const { globalLoading } = useStore();

  return (
    <>
      {globalLoading && <LoadingScreen />}

      <SliderNavbar />

      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Routes location={location}>
            <Route path="/" element={<AuthPage />} />
            <Route path="/bidpage" element={<BidPage />} />
            <Route path="/bidpage/chatRoom" element={<BidPageChatRoom />} />
            <Route path="/createBid" element={<CreateBidPage />} />
            <Route path="/apiTestSwagger" element={<ApiTestSwagger />} />
            <Route path="/myBids" element={<MyBidsPage />} />
            <Route path="/wallet" element={<WalletPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;
