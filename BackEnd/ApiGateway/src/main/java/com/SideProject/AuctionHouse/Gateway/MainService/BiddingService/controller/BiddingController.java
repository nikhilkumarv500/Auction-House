package com.SideProject.AuctionHouse.Gateway.MainService.BiddingService.controller;

import com.SideProject.AuctionHouse.Gateway.MainService.BiddingService.dto.requestDto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("apigateway")
public class BiddingController {

    @Autowired
    BiddingControllerFeign auctionListingFeign;

    @PostMapping(
            value = "/bid/createBid",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> createBid (
            @RequestPart(value = "item_image", required = false) MultipartFile item_image,
            @RequestParam(required = false) String sell_user_email,
            @RequestParam(required = false) String item_price,
            @RequestParam(required = false) String item_description,
            @RequestParam(required = false) String end_date_time,
            @RequestParam(required = false) String item_name
    ) {
        ResponseEntity<Object> response = auctionListingFeign.createBid(
                item_image,
                sell_user_email,
                item_price,
                item_description,
                end_date_time,
                item_name);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @GetMapping("/bid/getActiveBids")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> getActiveBids() {
        ResponseEntity<Object> response = auctionListingFeign.getActiveBids();

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @GetMapping("bid/getAllOldBidsList")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> getAllOldBidsList() {
        ResponseEntity<Object> response = auctionListingFeign.getAllOldBidsList();

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @PostMapping("chat/submitBidForAuction")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> submitBidForAuction(@RequestBody SubmitBidForAuctionRequestDto submitBidForAuctionRequestDto) {
        ResponseEntity<Object> response = auctionListingFeign.submitBidForAuction(submitBidForAuctionRequestDto);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @GetMapping("/bid/bulkBidItemSell")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> bulkBidItemSell() {
        ResponseEntity<Object> response = auctionListingFeign.bulkBidItemSell();

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @PostMapping("/bid/toForceEndBid")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> toForceEndBid(@RequestBody ToForceEndBidRequestDto requestDto) {
        ResponseEntity<Object> response = auctionListingFeign.toForceEndBid(requestDto);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @PostMapping("/bid/getMyBidsList/{mode}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> getMyBidsList(@PathVariable("mode") String mode, @RequestBody OnlyEmailRequestDto requestDto){
        ResponseEntity<Object> response = auctionListingFeign.getMyBidsList(mode, requestDto);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    // ********** start : test apis

    @DeleteMapping("/bid/deleteBid/{bid_id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> deleteBid(@PathVariable("bid_id") Long bid_id) {
        ResponseEntity<Object> response = auctionListingFeign.deleteBid(bid_id);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @GetMapping("bid/getAllBidsList")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> getAllBidsList() {
        ResponseEntity<Object> response = auctionListingFeign.getAllBidsList();

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @PostMapping("bid/createSampleOldBid")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> createSampleOldBid(@RequestBody CreateSampleOldBidRequestDto createSampleOldBidRequestDto) {
        ResponseEntity<Object> response = auctionListingFeign.createSampleOldBid(createSampleOldBidRequestDto);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @GetMapping("bid/doGeneralUpdateBroadCaseWebsocket")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> doGeneralUpdateBroadCaseWebsocket() {
        ResponseEntity<Object> response = auctionListingFeign.doGeneralUpdateBroadCaseWebsocket();

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @PostMapping("chat/createBidChat")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Object> createBidChat(@RequestBody CreateBidChatRequestDto createBidChatRequestDto) {
        ResponseEntity<Object> response = auctionListingFeign.createBidChat(createBidChatRequestDto);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @PostMapping("chat/createBidAmount")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Object> createBidAmount(@RequestBody CreateBidamountRequestDto createBidAmountRequestDto) {
        ResponseEntity<Object> response = auctionListingFeign.createBidAmount(createBidAmountRequestDto);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @GetMapping("chat/getBidChatFor/{bid_id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> getBidChatFor(@PathVariable("bid_id") Long bid_id) {
        ResponseEntity<Object> response = auctionListingFeign.getBidChatFor(bid_id);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @PostMapping("chat/getBidAmountFor")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> getBidAmountFor(@RequestBody GetBidAmountForRequestDto getBidAmountForRequestDto) {
        ResponseEntity<Object> response = auctionListingFeign.getBidAmountFor(getBidAmountForRequestDto);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @DeleteMapping("/bid/deleteEveryThingForABidId/{bid_id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Object> deleteEveryThingForABidId(@PathVariable("bid_id") Long bid_id) {
        ResponseEntity<Object> response = auctionListingFeign.deleteEveryThingForABidId(bid_id);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @GetMapping("/bid/apiConnectiontestFromMainService")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> apiConnectiontestFromMainService() {
        ResponseEntity<Object> response = auctionListingFeign.apiConnectiontestFromMainService();

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @GetMapping("/bid/redisStreamSimpleTest")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> redisStreamSimpleTest() {
        ResponseEntity<Object> response = auctionListingFeign.redisStreamSimpleTest();

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @GetMapping("/personal/broadcastBalanceAmount")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> broadcastBalanceAmount() {
        ResponseEntity<Object> response = auctionListingFeign.broadcastBalanceAmount();

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    // ********** end : test apis

}