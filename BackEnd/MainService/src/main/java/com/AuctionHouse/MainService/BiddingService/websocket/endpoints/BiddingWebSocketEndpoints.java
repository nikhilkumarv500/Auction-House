package com.AuctionHouse.MainService.BiddingService.websocket.endpoints;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class BiddingWebSocketEndpoints {

    @MessageMapping("/bids/generalUpdateChannel")
    @SendTo("/topic/bids/generalUpdateChannel")
    public Object sendBid(
            Object obj
    ) {
        return obj;
    }

}

