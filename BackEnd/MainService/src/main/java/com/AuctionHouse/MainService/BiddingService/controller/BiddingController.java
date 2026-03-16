package com.AuctionHouse.MainService.BiddingService.controller;


import com.AuctionHouse.MainService.BiddingService.Dto.RequestDto.CreateSampleOldBidRequestDto;
import com.AuctionHouse.MainService.BiddingService.Dto.RequestDto.OnlyEmailRequestDto;
import com.AuctionHouse.MainService.BiddingService.Dto.RequestDto.ToForceEndBidRequestDto;
import com.AuctionHouse.MainService.BiddingService.Dto.ResponseDto.GeneralErrorDto;
import com.AuctionHouse.MainService.BiddingService.service.BiddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController()
@RequestMapping("/mainservice/bid")
public class BiddingController {

    @Autowired
    BiddingService biddingService;

    @PostMapping(
            value = "/createBid",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Object>createBid (@RequestPart(value = "item_image", required = false) MultipartFile item_image,
                                            @RequestParam(required = false) String sell_user_email,
                                            @RequestParam(required = false) String item_price,
                                            @RequestParam(required = false) String item_description,
                                            @RequestParam(required = false) String end_date_time,
                                            @RequestParam(required = false) String item_name) {

            return biddingService.createBid(
                    item_image,
                    sell_user_email,
                    item_price,
                    item_description,
                    end_date_time ,
                    item_name);

    }

    @GetMapping("/getActiveBids")
    public ResponseEntity<Object> getActiveBids() {
        return biddingService.getActiveBids();
    }


    @GetMapping("/getAllOldBidsList")
    public ResponseEntity<Object> getAllOldBidsList() { return biddingService.getAllOldBidsList();}

    @GetMapping("/bulkBidItemSell")
    public ResponseEntity<Object> bulkBidItemSell() { return biddingService.bulkBidItemSell();}

    @PostMapping("/toForceEndBid")
    public ResponseEntity<Object> toForceEndBid(@RequestBody ToForceEndBidRequestDto requestDto)
    {return biddingService.toForceEndBid(requestDto);}

    @PostMapping("/getMyBidsList/{mode}")
    public ResponseEntity<Object> getMyBidsList(@PathVariable("mode") String mode, @RequestBody OnlyEmailRequestDto requestDto) {
        return biddingService.getMyBidsList(mode, requestDto);
    }

    //--------- start : test apis

    @DeleteMapping("/deleteBid/{bid_id}")
    public ResponseEntity<Object> deleteBid(@PathVariable("bid_id") Long bid_id) {
        return biddingService.deleteBid(bid_id);
    }

    @GetMapping("/getAllBidsList")
    public ResponseEntity<Object> getAllBidsList() { return biddingService.getAllBidsList();}

    @PostMapping("/createSampleOldBid")
    public ResponseEntity<Object> createSampleOldBid(@RequestBody CreateSampleOldBidRequestDto createSampleOldBidRequestDto)
    {return biddingService.createSampleOldBid(createSampleOldBidRequestDto);}

    @GetMapping("/doGeneralUpdateBroadCaseWebsocket")
    public ResponseEntity<Object> doGeneralUpdateBroadCaseWebsocket() {
        return biddingService.doGeneralUpdateBroadCaseWebsocket();
    }

    @DeleteMapping("/deleteEveryThingForABidId/{bid_id}")
    public ResponseEntity<Object> deleteEveryThingForABidId(@PathVariable("bid_id") Long bid_id) {
        return biddingService.deleteEveryThingForABidId(bid_id);
    }

    @GetMapping("/apiConnectiontestFromMainService")
    public ResponseEntity<Object> apiConnectiontestFromMainService() {
        return biddingService.apiConnectiontestFromMainService();
    }

    @GetMapping("/redisStreamSimpleTest")
    public ResponseEntity<Object> redisStreamSimpleTest() {
        return biddingService.redisStreamSimpleTest();
    }


    //--------- end : test apis

}
