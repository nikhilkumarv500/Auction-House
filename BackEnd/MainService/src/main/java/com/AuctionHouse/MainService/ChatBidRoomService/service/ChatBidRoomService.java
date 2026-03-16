package com.AuctionHouse.MainService.ChatBidRoomService.service;

import com.AuctionHouse.MainService.BiddingService.Dto.ResponseDto.GeneralErrorDto;
import com.AuctionHouse.MainService.BiddingService.entity.Bid_item;
import com.AuctionHouse.MainService.BiddingService.entity.Local_user_details;
import com.AuctionHouse.MainService.BiddingService.repo.Bid_item_repo;
import com.AuctionHouse.MainService.BiddingService.repo.Local_user_details_repo;
import com.AuctionHouse.MainService.BiddingService.service.BiddingService;
import com.AuctionHouse.MainService.ChatBidRoomService.dto.requestDto.CreateBidChatRequestDto;
import com.AuctionHouse.MainService.ChatBidRoomService.dto.requestDto.CreateBidamountRequestDto;
import com.AuctionHouse.MainService.ChatBidRoomService.dto.requestDto.GetBidAmountForRequestDto;
import com.AuctionHouse.MainService.ChatBidRoomService.dto.requestDto.SubmitBidForAuctionRequestDto;
import com.AuctionHouse.MainService.ChatBidRoomService.dto.responseDto.GetBidAmountForResponseDto;
import com.AuctionHouse.MainService.ChatBidRoomService.dto.responseDto.GetBidChatForResponseDto;
import com.AuctionHouse.MainService.ChatBidRoomService.dto.responseDto.SubmitBidForAuctionResponseDto;
import com.AuctionHouse.MainService.ChatBidRoomService.dto.responseDto.SubmitBidWebSocketBroadcastResponseDto;
import com.AuctionHouse.MainService.ChatBidRoomService.entity.Bid_amount;
import com.AuctionHouse.MainService.ChatBidRoomService.entity.Bid_chat;
import com.AuctionHouse.MainService.ChatBidRoomService.repo.Bid_amount_repo;
import com.AuctionHouse.MainService.ChatBidRoomService.repo.Bid_chat_repo;
import com.AuctionHouse.MainService.ChatBidRoomService.websocket.controller.ChatServiceWebsocketController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class ChatBidRoomService {

    @Autowired
    Bid_chat_repo bidChatRepo;

    @Autowired
    Bid_amount_repo bidAmountRepo;

    @Autowired
    Bid_item_repo bidItemRepo;

    @Autowired
    Local_user_details_repo localUserDetailsRepo;

    @Autowired
    ChatServiceWebsocketController chatServiceWebsocketController;

    @Autowired
    BiddingService biddingService;

    public ResponseEntity<Object> submitBidForAuction(SubmitBidForAuctionRequestDto submitBidForAuctionRequestDto) {

        if(submitBidForAuctionRequestDto.getBid_id()==null || submitBidForAuctionRequestDto.getPurchase_price()==null || submitBidForAuctionRequestDto.getPurchase_user_email()==null
                || submitBidForAuctionRequestDto.getPurchase_user_name()==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Few fields are missing", HttpStatus.BAD_REQUEST.value()));
        }

        // ******* start : sufficient money check

        Bid_amount bidAmountObj = null;

        try {
            bidAmountObj=bidAmountRepo.findByPurchase_user_email_and_bid_id(submitBidForAuctionRequestDto.getPurchase_user_email(), submitBidForAuctionRequestDto.getBid_id());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_amount Db-table | in submitBidForAuction",HttpStatus.BAD_REQUEST.value()));
        }

        Local_user_details userBalanceDetailsObj = null;
        Long userFinalPayAmount = submitBidForAuctionRequestDto.getPurchase_price() - (bidAmountObj!=null ? bidAmountObj.getTotal_amount_spent() : 0L);

        try {
            userBalanceDetailsObj=localUserDetailsRepo.findByEmail(submitBidForAuctionRequestDto.getPurchase_user_email());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Local_user_details Db-table | in submitBidForAuction",HttpStatus.BAD_REQUEST.value()));
        }

        if(userBalanceDetailsObj==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"No user exists",HttpStatus.BAD_REQUEST.value()));
        }

        if(userBalanceDetailsObj.getBalance_amount() < userFinalPayAmount) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Insufficient balance",HttpStatus.BAD_REQUEST.value()));
        }

        // ------- end : sufficient money check

        // ******* start : fetch current highest bid for that item
        Bid_item currentItem = null;

        try {
            currentItem  = bidItemRepo.findById(submitBidForAuctionRequestDto.getBid_id()).orElse(null);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in submitBidForAuction",HttpStatus.BAD_REQUEST.value()));
        }

        if(currentItem==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"No auction exits with requested id", HttpStatus.BAD_REQUEST.value()));
        }

        Long old_highest_bid = currentItem.getHighest_bid();


        if((old_highest_bid!=null && old_highest_bid>=submitBidForAuctionRequestDto.getPurchase_price()) ||
        submitBidForAuctionRequestDto.getPurchase_price()<currentItem.getItem_price()) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "your bid cannot be lower then current/highest bid", HttpStatus.BAD_REQUEST.value()));
        }

        // ------- end : fetch current highest bid for that item

        // ******* start : update highest bid in Bid_item table
        currentItem.setHighest_bid(submitBidForAuctionRequestDto.getPurchase_price());
        currentItem.setHighest_bid_person(submitBidForAuctionRequestDto.getPurchase_user_name());
        currentItem.setHighest_bid_person_email(submitBidForAuctionRequestDto.getPurchase_user_email());

        try {
            bidItemRepo.save(currentItem);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in submitBidForAuction",HttpStatus.BAD_REQUEST.value()));
        }
        // --------- end : update highest bid in Bid_item table

        // ********* start : update or add highest in Bid-amount table

        if(bidAmountObj==null) {
            bidAmountObj = Bid_amount.builder()
                    .bid_id(submitBidForAuctionRequestDto.getBid_id())
                    .purchase_user_email(submitBidForAuctionRequestDto.getPurchase_user_email())
                    .total_amount_spent(submitBidForAuctionRequestDto.getPurchase_price())
                    .build();
        } else {
            bidAmountObj.setTotal_amount_spent(submitBidForAuctionRequestDto.getPurchase_price());
        }

        try {
            bidAmountRepo.save(bidAmountObj);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_amount Db-table | in submitBidForAuction",HttpStatus.BAD_REQUEST.value()));
        }

        // ----------------- end : update or add highest in Bid-amount table

        // ************** start : update user money balance

        userBalanceDetailsObj.setBalance_amount(userBalanceDetailsObj.getBalance_amount() - userFinalPayAmount);

        try {
           localUserDetailsRepo.save(userBalanceDetailsObj);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Local_user_details Db-table | in submitBidForAuction",HttpStatus.BAD_REQUEST.value()));
        }

        // --------------- end : update user money balance

        // ************* start : do a entry in auction chat (Bid_chat)

        Bid_chat bidChatObj = Bid_chat.builder()
                .bid_id(submitBidForAuctionRequestDto.getBid_id())
                .msg_post_date_time(System.currentTimeMillis())
                .purchase_user_email(submitBidForAuctionRequestDto.getPurchase_user_email())
                .purchase_user_name(submitBidForAuctionRequestDto.getPurchase_user_name())
                .purchase_price(submitBidForAuctionRequestDto.getPurchase_price())
                .build();

        try {
            bidChatRepo.save(bidChatObj);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_chat Db-table | in submitBidForAuction",HttpStatus.BAD_REQUEST.value()));
        }

        // ------------- end : do a entry in auction chat (Bid_chat)

        // ************* start : do a bid chat broadcast
        List<Bid_chat> bidChatBroadcastChatList = null;

        try {
            bidChatBroadcastChatList = bidChatRepo.findAllByBid_id(submitBidForAuctionRequestDto.getBid_id());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_chat Db-table | in submitBidForAuction",HttpStatus.BAD_REQUEST.value()));
        }

        String bidChatBroadcastMessage = submitBidForAuctionRequestDto.getPurchase_user_name() + " just bid : ₹ " + Long.toString(submitBidForAuctionRequestDto.getPurchase_price());

        SubmitBidWebSocketBroadcastResponseDto bidChatBroadcastObj = new SubmitBidWebSocketBroadcastResponseDto(false,bidChatBroadcastMessage,
                HttpStatus.OK.value(), bidChatBroadcastChatList, submitBidForAuctionRequestDto.getPurchase_price());

        chatServiceWebsocketController.doChatBidUpdateBroadcast(bidChatBroadcastObj, submitBidForAuctionRequestDto.getBid_id());
        // ------------- end : do a bid chat broadcast

        // ******** start : do general live broadcast in bid page
        ResponseEntity<Object> generalUpdateDecsionObj = biddingService.doGeneralUpdateWebsocketBroadcastInBiddingService();
        if(generalUpdateDecsionObj!=null) return generalUpdateDecsionObj;
        // ******** end : do general live broadcast in bid page

        return ResponseEntity.status(HttpStatus.OK)
                .body(new SubmitBidForAuctionResponseDto(false,"Successfully Submitted the bid ",
                        HttpStatus.OK.value(), userBalanceDetailsObj.getBalance_amount(), submitBidForAuctionRequestDto.getPurchase_price()));
    }


    //******** start : test apis

    public ResponseEntity<Object> createBidChat(CreateBidChatRequestDto createBidChatRequestDto) {

        if(createBidChatRequestDto.getBid_id()==null || createBidChatRequestDto.getPurchase_price()==null || createBidChatRequestDto.getPurchase_user_email()==null
        || createBidChatRequestDto.getPurchase_user_name()==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Few fields are missing", HttpStatus.BAD_REQUEST.value()));
        }

        Bid_chat bidChatObj = Bid_chat.builder()
                            .bid_id(createBidChatRequestDto.getBid_id())
                            .msg_post_date_time(System.currentTimeMillis())
                            .purchase_user_email(createBidChatRequestDto.getPurchase_user_email())
                            .purchase_user_name(createBidChatRequestDto.getPurchase_user_name())
                            .purchase_price(createBidChatRequestDto.getPurchase_price())
                            .build();

        try {
            bidChatRepo.save(bidChatObj);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_chat Db-table | in createBidChat",HttpStatus.BAD_REQUEST.value()));
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(false,"Successfully created a bid chat",HttpStatus.OK.value()));
    }

    public ResponseEntity<Object> createBidAmount(CreateBidamountRequestDto createBidAmountRequestDto) {

        if(createBidAmountRequestDto.getBid_id()==null || createBidAmountRequestDto.getTotal_amount_spent()==null
        || createBidAmountRequestDto.getPurchase_user_email()==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Few fields are missing", HttpStatus.BAD_REQUEST.value()));
        }

        Bid_amount bidAmountObj = Bid_amount.builder()
                .bid_id(createBidAmountRequestDto.getBid_id())
                .total_amount_spent(createBidAmountRequestDto.getTotal_amount_spent())
                .purchase_user_email(createBidAmountRequestDto.getPurchase_user_email())
                .build();

        try {
            bidAmountRepo.save(bidAmountObj);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_amount Db-table | in createBidAmount",HttpStatus.BAD_REQUEST.value()));
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(false,"Successfully created a bid amount",HttpStatus.OK.value()));
    }

    public ResponseEntity<Object> getBidChatFor(Long bidId) {

        if(bidId==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Few fields are missing", HttpStatus.BAD_REQUEST.value()));
        }

        List<Bid_chat> bidChatList= new ArrayList<>();

        try {
            bidChatList = bidChatRepo.findAllByBid_id(bidId);

            bidChatList.sort(
                    Comparator.comparing(Bid_chat::getMsg_post_date_time)
            );
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_chat Db-table | in getBidChatFor",HttpStatus.BAD_REQUEST.value()));
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(new GetBidChatForResponseDto(false,"Successfully Fetched bids",HttpStatus.OK.value(),bidChatList));
    }

    public ResponseEntity<Object> getBidAmountFor(GetBidAmountForRequestDto getBidAmountForRequestDto) {

        if(getBidAmountForRequestDto.getUser_email()==null || getBidAmountForRequestDto.getBid_id()==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Few fields are missing", HttpStatus.BAD_REQUEST.value()));
        }

        Bid_amount bidAmountObj = null;

        try {
            bidAmountObj=bidAmountRepo.findByPurchase_user_email_and_bid_id(getBidAmountForRequestDto.getUser_email(), getBidAmountForRequestDto.getBid_id());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_amount Db-table | in getBidAmountFor",HttpStatus.BAD_REQUEST.value()));
        }

        if(bidAmountObj==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GetBidAmountForResponseDto(false,"User has not bid any amount yet",HttpStatus.OK.value()
                            ,null));
        }


        return ResponseEntity.status(HttpStatus.OK)
                .body(new GetBidAmountForResponseDto(false,"Successfully fetched total spent amount",HttpStatus.OK.value()
                        ,bidAmountObj.getTotal_amount_spent()));
    }


    //--------- end : test apis
}
