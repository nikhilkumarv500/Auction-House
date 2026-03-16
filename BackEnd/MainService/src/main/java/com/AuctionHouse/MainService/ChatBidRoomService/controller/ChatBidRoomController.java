package com.AuctionHouse.MainService.ChatBidRoomService.controller;

import com.AuctionHouse.MainService.ChatBidRoomService.dto.requestDto.CreateBidChatRequestDto;
import com.AuctionHouse.MainService.ChatBidRoomService.dto.requestDto.CreateBidamountRequestDto;
import com.AuctionHouse.MainService.ChatBidRoomService.dto.requestDto.GetBidAmountForRequestDto;
import com.AuctionHouse.MainService.ChatBidRoomService.dto.requestDto.SubmitBidForAuctionRequestDto;
import com.AuctionHouse.MainService.ChatBidRoomService.service.ChatBidRoomService;
import feign.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/mainservice/chat")
public class ChatBidRoomController {

    @Autowired
    ChatBidRoomService chatBidRoomService;

    @PostMapping("/submitBidForAuction")
    public ResponseEntity<Object> submitBidForAuction(@RequestBody SubmitBidForAuctionRequestDto submitBidForAuctionRequestDto) {
        return chatBidRoomService.submitBidForAuction(submitBidForAuctionRequestDto);
    }

    //******** start : test apis

    @PostMapping("/createBidChat")
    public ResponseEntity<Object> createBidChat(@RequestBody CreateBidChatRequestDto createBidChatRequestDto) {
        return chatBidRoomService.createBidChat(createBidChatRequestDto);
    }

    @PostMapping("/createBidAmount")
    public ResponseEntity<Object> createBidAmount(@RequestBody CreateBidamountRequestDto createBidAmountRequestDto) {
        return chatBidRoomService.createBidAmount(createBidAmountRequestDto);
    }

    @GetMapping("/getBidChatFor/{bid_id}")
    public ResponseEntity<Object> getBidChatFor(@PathVariable("bid_id") Long bid_id) {
        return chatBidRoomService.getBidChatFor(bid_id);
    }

    @PostMapping("/getBidAmountFor")
    public ResponseEntity<Object> getBidAmountFor(@RequestBody GetBidAmountForRequestDto getBidAmountForRequestDto) {
        return chatBidRoomService.getBidAmountFor(getBidAmountForRequestDto);
    }

    //--------- end : test apis
}
