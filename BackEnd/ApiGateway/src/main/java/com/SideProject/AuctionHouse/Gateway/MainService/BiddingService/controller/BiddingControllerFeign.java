package com.SideProject.AuctionHouse.Gateway.MainService.BiddingService.controller;

import com.SideProject.AuctionHouse.Gateway.MainService.BiddingService.dto.requestDto.*;
import com.SideProject.AuctionHouse.Gateway.config.GeneralFeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name="${feign.mainservice.project.name}", configuration = GeneralFeignConfig.class)
public interface BiddingControllerFeign {


    @PostMapping(
            value = "/mainservice/bid/createBid",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Object> createBid (@RequestPart(value = "item_image", required = false) MultipartFile item_image,
                                             @RequestParam(required = false) String sell_user_email,
                                             @RequestParam(required = false) String item_price,
                                             @RequestParam(required = false) String item_description,
                                             @RequestParam(required = false) String end_date_time,
                                             @RequestParam(required = false) String item_name);

    @GetMapping("/mainservice/bid/getActiveBids")
    public ResponseEntity<Object> getActiveBids();

    @GetMapping("/mainservice/bid/getAllOldBidsList")
    public ResponseEntity<Object> getAllOldBidsList();

    @PostMapping("/mainservice/chat/submitBidForAuction")
    public ResponseEntity<Object> submitBidForAuction(@RequestBody SubmitBidForAuctionRequestDto submitBidForAuctionRequestDto);

    @GetMapping("/mainservice/bid/bulkBidItemSell")
    public ResponseEntity<Object> bulkBidItemSell();

    @PostMapping("/mainservice/bid/toForceEndBid")
    public ResponseEntity<Object> toForceEndBid(@RequestBody ToForceEndBidRequestDto requestDto);

    @PostMapping("/mainservice/bid/getMyBidsList/{mode}")
    public ResponseEntity<Object> getMyBidsList(@PathVariable("mode") String mode, @RequestBody OnlyEmailRequestDto requestDto);

    // *********** start : test apis

    @DeleteMapping("/mainservice/bid/deleteBid/{bid_id}")
    public ResponseEntity<Object> deleteBid(@PathVariable("bid_id") Long bid_id);

    @GetMapping("/mainservice/bid/getAllBidsList")
    public ResponseEntity<Object> getAllBidsList();

    @PostMapping("/mainservice/bid/createSampleOldBid")
    public ResponseEntity<Object> createSampleOldBid(@RequestBody CreateSampleOldBidRequestDto createSampleOldBidRequestDto);

    @GetMapping("/mainservice/bid/doGeneralUpdateBroadCaseWebsocket")
    public ResponseEntity<Object> doGeneralUpdateBroadCaseWebsocket();

    @PostMapping("/mainservice/chat/createBidChat")
    public ResponseEntity<Object> createBidChat(@RequestBody CreateBidChatRequestDto createBidChatRequestDto);

    @PostMapping("/mainservice/chat/createBidAmount")
    public ResponseEntity<Object> createBidAmount(@RequestBody CreateBidamountRequestDto createBidAmountRequestDto);

    @GetMapping("/mainservice/chat/getBidChatFor/{bid_id}")
    public ResponseEntity<Object> getBidChatFor(@PathVariable("bid_id") Long bid_id);

    @PostMapping("/mainservice/chat/getBidAmountFor")
    public ResponseEntity<Object> getBidAmountFor(@RequestBody GetBidAmountForRequestDto getBidAmountForRequestDto);

    @DeleteMapping("/mainservice/bid/deleteEveryThingForABidId/{bid_id}")
    public ResponseEntity<Object> deleteEveryThingForABidId(@PathVariable("bid_id") Long bid_id);

    @GetMapping("/mainservice/bid/apiConnectiontestFromMainService")
    public ResponseEntity<Object> apiConnectiontestFromMainService();

    @GetMapping("/mainservice/bid/redisStreamSimpleTest")
    public ResponseEntity<Object> redisStreamSimpleTest();

    @GetMapping("/mainservice/personal/broadcastBalanceAmount")
    public ResponseEntity<Object> broadcastBalanceAmount();

    // *********** end : test apis


}
