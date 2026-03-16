package com.AuctionHouse.MainService.BiddingService.websocket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class BiddingWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void doGeneralUpdateBroadcast(Object obj) {
        messagingTemplate.convertAndSend(
                "/topic/bids/generalUpdateChannel",
                obj
        );
    }
}
