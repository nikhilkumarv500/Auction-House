import SockJS from "sockjs-client";
import { Client, Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";

let client;

export const connectBidPageChatRoomSocket = (token, onMessage, bid_id) => {
  const mainServiceWebsocketLocalHostUrl = import.meta.env
    .VITE_MAINSERVICE_API_BE_URL;

  client = new Client({
    webSocketFactory: () =>
      new SockJS(`${mainServiceWebsocketLocalHostUrl}/ws?token=${token}`),

    reconnectDelay: 0,

    onConnect: () => {
      toast.success("Connected to Live Chat room server", {
        autoClose: 5000,
      });

      client.subscribe(`/topic/chat/${bid_id}`, (msg) => {
        onMessage(JSON.parse(msg.body));
      });
    },

    onStompError: (frame) => {
      //   console.error("STOMP error", frame);
      toast.info("Error in connecting to Live Chat room server", {
        autoClose: 5000,
      });
    },

    onWebSocketClose: (evt) => {
      toast.info("Disconnected from Live Chat room server", {
        autoClose: 5000,
      });
    },
  });

  client.activate();
};

export const disconnectBidPageChatRoomSocket = () => {
  if (client && client.active) {
    client.deactivate();
    client = null;
  }
};

export const broadcastToGeneralUpdateChannel = (bid, bid_id) => {
  client.send(`/app/chat/${bid_id}`, {}, JSON.stringify(bid));
};
