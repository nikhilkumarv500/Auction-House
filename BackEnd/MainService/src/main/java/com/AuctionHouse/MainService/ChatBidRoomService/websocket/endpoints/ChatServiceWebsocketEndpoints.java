package com.AuctionHouse.MainService.ChatBidRoomService.websocket.endpoints;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatServiceWebsocketEndpoints {

    @MessageMapping("/chat/{auctionId}")
    @SendTo("/topic/chat/{auctionId}")
    public Object sendBid(
            @DestinationVariable String auctionId,
            Object obj
    ) {
        return obj;
    }

}
