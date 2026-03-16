package com.AuctionHouse.MainService.PersonalDetailsService.controller;

import com.AuctionHouse.MainService.PersonalDetailsService.service.PersonalDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/mainservice/personal")
public class PersonalDetailsController {

    @Autowired
    PersonalDetailsService personalDetailsService;

    //******** start : test apis
    @GetMapping("/broadcastBalanceAmount")
    public ResponseEntity<Object> broadcastBalanceAmount() {
        return personalDetailsService.broadcastBalanceAmount();
    }
    //-------- end : test apis

}
