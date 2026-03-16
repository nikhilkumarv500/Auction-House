import SockJS from "sockjs-client";
import { Client, Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";

let client;

export const connectGeneralUpdateSocket = (token, onMessage) => {
  const mainServiceWebsocketLocalHostUrl = import.meta.env
    .VITE_MAINSERVICE_API_BE_URL;

  client = new Client({
    webSocketFactory: () =>
      new SockJS(`${mainServiceWebsocketLocalHostUrl}/ws?token=${token}`),

    reconnectDelay: 0,

    onConnect: () => {
      toast.success("Connected to Live bid page server", {
        autoClose: 5000,
      });

      client.subscribe("/topic/bids/generalUpdateChannel", (msg) => {
        onMessage(JSON.parse(msg.body));
      });
    },

    onStompError: (frame) => {
      //   console.error("STOMP error", frame);
      toast.info("Error in connecting to Live bid page server", {
        autoClose: 5000,
      });
    },

    onWebSocketClose: (evt) => {
      toast.info("Disconnected from Live bid page server", {
        autoClose: 5000,
      });
    },
  });

  client.activate();
};

export const disconnectGeneralUpdateSocket = () => {
  if (client && client.active) {
    client.deactivate();
    client = null;
  }
};

export const broadcastToGeneralUpdateChannel = (bid) => {
  client.send(`/app/bids/generalUpdateChannel`, {}, JSON.stringify(bid));
};
