package com.AuctionHouse.MainService.PersonalDetailsService.service;

import com.AuctionHouse.MainService.BiddingService.Dto.ResponseDto.GeneralErrorDto;
import com.AuctionHouse.MainService.BiddingService.entity.Local_user_details;
import com.AuctionHouse.MainService.BiddingService.repo.Local_user_details_repo;
import com.AuctionHouse.MainService.ChatBidRoomService.dto.responseDto.GetBidChatForResponseDto;
import com.AuctionHouse.MainService.PersonalDetailsService.dto.responseDto.BroadcastBalanceAmountResponseDto;
import com.AuctionHouse.MainService.PersonalDetailsService.websocket.controller.PersonalDetailsWebsocketController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PersonalDetailsService {

    @Autowired
    Local_user_details_repo localUserDetailsRepo;

    @Autowired
    PersonalDetailsWebsocketController personalDetailsWebsocketController;

    //******** start : test apis

    public ResponseEntity<Object> broadcastBalanceAmount() {


        List<Local_user_details> localUserDetailsList = new ArrayList<>();

        try {
            localUserDetailsList = localUserDetailsRepo.findAll();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Local_user_details BD-table | in broadcastBalanceAmount",HttpStatus.BAD_REQUEST.value()));
        }

        for(Local_user_details obj : localUserDetailsList) {
            BroadcastBalanceAmountResponseDto broadCastMsg = new BroadcastBalanceAmountResponseDto(obj.getBalance_amount(), obj.getEmail());
            personalDetailsWebsocketController.doPersonalDetailsBroadcast(broadCastMsg, obj.getEmail());
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(false,"Successfully broadcasted general amount",HttpStatus.OK.value()));
    }

    //--------- end : test apis
}
