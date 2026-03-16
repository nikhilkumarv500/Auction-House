package com.AuctionHouse.MainService.ChatBidRoomService.websocket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class ChatServiceWebsocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void doChatBidUpdateBroadcast(Object obj, Long bid_id) {

        String url = "/topic/chat/" + Long.toString(bid_id);

        messagingTemplate.convertAndSend(
                url,
                obj
        );
    }
}
