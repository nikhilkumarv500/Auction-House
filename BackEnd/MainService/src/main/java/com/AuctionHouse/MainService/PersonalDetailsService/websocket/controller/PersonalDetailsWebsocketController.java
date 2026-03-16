package com.AuctionHouse.MainService.PersonalDetailsService.websocket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class PersonalDetailsWebsocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void doPersonalDetailsBroadcast(Object obj, String email) {

        String url = "/topic/personal/" + email;

        messagingTemplate.convertAndSend(
                url,
                obj
        );
    }
}
