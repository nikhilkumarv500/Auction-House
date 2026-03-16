import SockJS from "sockjs-client";
import { Client, Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";

let client;

export const connectPersonalDetailsBroadcastWebsocket = (
  token,
  onMessage,
  email,
) => {
  const mainServiceWebsocketLocalHostUrl = import.meta.env
    .VITE_MAINSERVICE_API_BE_URL;

  client = new Client({
    webSocketFactory: () =>
      new SockJS(`${mainServiceWebsocketLocalHostUrl}/ws?token=${token}`),

    reconnectDelay: 0,

    onConnect: () => {
      //   toast.success("Connected to Live Chat room server", {
      //     autoClose: 5000,
      //   });
      console.log("Connected to Live Personal details broadcast server");

      client.subscribe(`/topic/personal/${email}`, (msg) => {
        onMessage(JSON.parse(msg.body));
      });
    },

    onStompError: (frame) => {
      //   console.error("STOMP error", frame);
      toast.info(
        "Error in connecting to Live Personal details broadcast server",
        {
          autoClose: 5000,
        },
      );
    },

    onWebSocketClose: (evt) => {
      toast.info("Disconnected from Live Personal details broadcast server", {
        autoClose: 5000,
      });
    },
  });

  client.activate();
};

export const disconnectPersonalDetailsBroadcastWebsocket = () => {
  if (client && client.active) {
    client.deactivate();
    client = null;
  }
};

export const broadcastToPersonalDetailsBroadcastWebsocket = (bid, email) => {
  client.send(`/app/personal/${email}`, {}, JSON.stringify(bid));
};
