package com.AuctionHouse.MainService.PersonalDetailsService.websocket.endpoint;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class PersonalDetailsWebsocketEndpoint {

    @MessageMapping("/personal/{email}")
    @SendTo("/topic/personal/{email}")
    public Object broadcastPersonalUpdate(
            @DestinationVariable String email,
            Object obj
    ) {
        return obj;
    }
}
