package com.AuctionHouse.MainService.BiddingService.service;

import com.AuctionHouse.MainService.AdditionalServices.ImageUploadService;
import com.AuctionHouse.MainService.BiddingService.Dto.RequestDto.CreateSampleOldBidRequestDto;
import com.AuctionHouse.MainService.BiddingService.Dto.RequestDto.OnlyEmailRequestDto;
import com.AuctionHouse.MainService.BiddingService.Dto.RequestDto.RedisInventoryServiceMyBidHistoryInsertRequestDto;
import com.AuctionHouse.MainService.BiddingService.Dto.RequestDto.ToForceEndBidRequestDto;
import com.AuctionHouse.MainService.BiddingService.Dto.ResponseDto.*;
import com.AuctionHouse.MainService.BiddingService.entity.Bid_item;
import com.AuctionHouse.MainService.BiddingService.entity.Local_user_details;
import com.AuctionHouse.MainService.BiddingService.entity.My_bids_history;
import com.AuctionHouse.MainService.BiddingService.entity.Old_bids;
import com.AuctionHouse.MainService.BiddingService.feign.InventoryControllerFeign;
import com.AuctionHouse.MainService.BiddingService.redisProducer.RedisProducerService;
import com.AuctionHouse.MainService.BiddingService.repo.My_bids_history_repo;
import com.AuctionHouse.MainService.BiddingService.repo.Old_bid_repo;
import com.AuctionHouse.MainService.BiddingService.repo.Bid_item_repo;
import com.AuctionHouse.MainService.BiddingService.repo.Local_user_details_repo;
import com.AuctionHouse.MainService.AdditionalServices.Util;
import com.AuctionHouse.MainService.BiddingService.websocket.controller.BiddingWebSocketController;
import com.AuctionHouse.MainService.ChatBidRoomService.entity.Bid_amount;
import com.AuctionHouse.MainService.ChatBidRoomService.repo.Bid_amount_repo;
import com.AuctionHouse.MainService.ChatBidRoomService.repo.Bid_chat_repo;
import com.AuctionHouse.MainService.PersonalDetailsService.dto.responseDto.BroadcastBalanceAmountResponseDto;
import com.AuctionHouse.MainService.PersonalDetailsService.websocket.controller.PersonalDetailsWebsocketController;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class BiddingService {

    @Autowired
    ImageUploadService imageUploadService;

    @Autowired
    Bid_item_repo bidItemRepo;

    @Autowired
    Local_user_details_repo localUserDetailsRepo;

    @Autowired
    Old_bid_repo bidHistoryRepo;

    @Autowired
    Bid_amount_repo bidAmountRepo;

    @Autowired
    Bid_chat_repo bidChatRepo;

    @Autowired
    My_bids_history_repo myBidsHistoryRepo;

    @Autowired
    BiddingWebSocketController biddingWebSocketController;

    @Autowired
    InventoryControllerFeign inventoryControllerFeign;

    @Autowired
    PersonalDetailsWebsocketController personalDetailsWebsocketController;

    @Autowired
    private RedisProducerService producerService;

    @Value("${general.image.unavailable}")
    private String generalImageUnavailable;

    public ResponseEntity<Object> createBid (MultipartFile item_image,
                                             String sell_user_email,
                                             String item_price_str,
                                             String item_description,
                                             String end_date_time_str,
                                             String item_name) {

        // ********* start : payload validation

        if(sell_user_email==null || item_price_str==null || item_description==null || end_date_time_str==null || item_name==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Few fields are missing", HttpStatus.BAD_REQUEST.value()));
        }

        if(Util.chkIsStrEmptyInList(List.of(sell_user_email, item_price_str, item_description, end_date_time_str, item_name))) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Few fields are missing", HttpStatus.BAD_REQUEST.value()));
        }

        Long item_price = null;

        try {
            item_price = item_price_str != null ? Long.parseLong(item_price_str) : null;
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Item price should be a number", HttpStatus.BAD_REQUEST.value()));
        }

        Long end_date_time=null;

        try {
            end_date_time = end_date_time_str != null ? Long.parseLong(end_date_time_str) : null;
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"End date time is not selected", HttpStatus.BAD_REQUEST.value()));
        }

        // ------------ end : payload validation


        Local_user_details currentUserDetail =  null;

        try {
            currentUserDetail =  localUserDetailsRepo.findByEmail(sell_user_email);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in accessing Local_user_details DB-table | in createBid", HttpStatus.BAD_REQUEST.value()));
        }

        if(currentUserDetail==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Email does not exists", HttpStatus.BAD_REQUEST.value()));
        }

        if(currentUserDetail.getBalance_amount() < 200L) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Insufficient balance", HttpStatus.BAD_REQUEST.value()));
        }

        //******* start : deduct fee money

        Long moneyAfterDeduct = currentUserDetail.getBalance_amount()-200L;

        try {
            currentUserDetail.setBalance_amount(moneyAfterDeduct);
            localUserDetailsRepo.save(currentUserDetail);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error while updating balance | in createBid",HttpStatus.BAD_REQUEST.value()));
        }

        //------- end : deduct fee money


        //******* start : upload image to cloudnary

        String imageUrl = null;

        MultipartFile image = item_image;

        if (image == null || image.isEmpty()) {
            imageUrl=generalImageUnavailable;
        }
        else {

            if (!image.getContentType().startsWith("image")) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new GeneralErrorDto(true,"Only image files allowed",HttpStatus.BAD_REQUEST.value()));
            }

            try {
                imageUrl = imageUploadService.uploadImage(image, currentUserDetail.getEmail());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new GeneralErrorDto(true,"Error while uploading image | in createBid",HttpStatus.BAD_REQUEST.value()));
            }

        }

        //------- end  : upload image to cloudnary

        Bid_item bid = Bid_item.builder()
                .post_date_time(System.currentTimeMillis())
                .sell_user_email(sell_user_email)
                .sell_user_name(currentUserDetail.getName())
                .item_image_url(imageUrl)
                .item_name(item_name)
                .item_price((Long) item_price)
                .item_description(item_description)
                .sold(false)
                .end_date_time((Long) end_date_time)
                .highest_bid(null)
                .highest_bid_person(null)
                .highest_bid_person_email(null)
                .build();


        try {
            bidItemRepo.save(bid);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in createBid",HttpStatus.BAD_REQUEST.value()));
        }

        ResponseEntity<Object> generalUpdateDecsionObj = doGeneralUpdateWebsocketBroadcastInBiddingService();
        if(generalUpdateDecsionObj!=null) return generalUpdateDecsionObj;

        return ResponseEntity.status(HttpStatus.OK)
                .body(new CreateBidResponseDto(false,"Successfully created bid",HttpStatus.OK.value(), moneyAfterDeduct));
    }

    public ResponseEntity<Object> getActiveBids() {

        List<Bid_item> bidItemList =  null;

        try {
            bidItemList= bidItemRepo.getNotSoldBids();

            bidItemList.sort(
                    Comparator.comparing(Bid_item::getPost_date_time).reversed()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in getActiveBids",HttpStatus.BAD_REQUEST.value()));
        }


        return ResponseEntity.status(HttpStatus.OK)
                .body(GetActiveBidsResponseDto.builder()
                        .error(false)
                        .bit_items_list(bidItemList)
                        .message("Successfully fetched all active bids")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    public ResponseEntity<Object> getAllOldBidsList() {
        List<Old_bids> oldBidItemList =  null;

        try {
            oldBidItemList= bidHistoryRepo.findAll();

            oldBidItemList.sort(
                    Comparator.comparing(Old_bids::getBid_end_date_time).reversed()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Old_bids Db-table | in getAllOldBidsList",HttpStatus.BAD_REQUEST.value()));
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(GetAllOldBidsResponseDto.builder()
                        .error(false)
                        .old_bid_items_list(oldBidItemList)
                        .message("Successfully fetched all old bids")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }


    public ResponseEntity<Object> doGeneralUpdateWebsocketBroadcastInBiddingService () {

        List<Bid_item> activeBidItemList =  null;
        try {
            activeBidItemList= bidItemRepo.getNotSoldBids();

            activeBidItemList.sort(
                    Comparator.comparing(Bid_item::getPost_date_time).reversed()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in doGeneralUpdateWebsocketBroadcast",HttpStatus.BAD_REQUEST.value()));
        }


        List<Old_bids> oldBidItemList =  null;
        try {
            oldBidItemList= bidHistoryRepo.findAll();

            oldBidItemList.sort(
                    Comparator.comparing(Old_bids::getBid_end_date_time).reversed()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Old_bids Db-table | in doGeneralUpdateWebsocketBroadcast",HttpStatus.BAD_REQUEST.value()));
        }

        biddingWebSocketController.doGeneralUpdateBroadcast(
                SendGeneralUpdateResponseDto.builder()
                        .activeBidItemList(activeBidItemList)
                        .oldBidItemList(oldBidItemList)
                        .build());

        return null;

    }

    @Transactional
    public ResponseEntity<Object> bulkBidItemSell() {

        // -------- start : populate expired Bid_items

        List<Bid_item> bidItemList = new ArrayList<>();

        try {
            bidItemList = bidItemRepo.findAll();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in bulkBidItemSell",HttpStatus.BAD_REQUEST.value()));
        }

        List<Bid_item> expiredBidItemList = new ArrayList<>();

        for(Bid_item obj : bidItemList) {
            if(obj.getEnd_date_time()<= (System.currentTimeMillis())) {
                expiredBidItemList.add(obj);
            }
        }

        // -------- end : populate expired Bid_items

        // ********* start : process individual Bid_item
        for(Bid_item expiredBidItemObj : expiredBidItemList) {
            ResponseEntity<Object> individualItemUpdateResponse = bulkBidItemSellSupportIndividualItemUpdate(expiredBidItemObj);

            if (individualItemUpdateResponse != null && individualItemUpdateResponse.getBody() != null) {
                GeneralErrorDto errorDto = (GeneralErrorDto) individualItemUpdateResponse.getBody();
                if(errorDto.getError()) return individualItemUpdateResponse;
            }
        }
        // ---------- end : process individual Bid_item

        // ******** start : do general live broadcast in bid page
        ResponseEntity<Object> generalUpdateDecsionObj = doGeneralUpdateWebsocketBroadcastInBiddingService();
        if(generalUpdateDecsionObj!=null) return generalUpdateDecsionObj;
        // ******** end : do general live broadcast in bid page

        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(false,"All success from bulkBidItemSell",HttpStatus.OK.value()));
    }

    public ResponseEntity<Object> bulkBidItemSellSupportIndividualItemUpdate(Bid_item expiredBidItemObj) {

        // ******** start : put entry in Old_bids
        Old_bids newOldBidObj = Old_bids.builder()
                .bid_id(expiredBidItemObj.getBid_id())
                .sell_user_email(expiredBidItemObj.getSell_user_email())
                .sell_user_name(expiredBidItemObj.getSell_user_name())
                .purchase_user_email(expiredBidItemObj.getHighest_bid_person_email())
                .purchase_user_name(expiredBidItemObj.getHighest_bid_person())
                .purchase_price(expiredBidItemObj.getHighest_bid())
                .item_image_url(expiredBidItemObj.getItem_image_url())
                .item_name(expiredBidItemObj.getItem_name())
                .item_description(expiredBidItemObj.getItem_description())
                .item_price(expiredBidItemObj.getItem_price())
                .bid_start_date_time(expiredBidItemObj.getPost_date_time())
                .bid_end_date_time(expiredBidItemObj.getEnd_date_time())
                .bid_end_date_time_for_dev_purpose(System.currentTimeMillis())
                .build();

        try {
            bidHistoryRepo.save(newOldBidObj);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Old_bids Db-table | in bulkBidItemSellSupportIndividualItemUpdate",HttpStatus.BAD_REQUEST.value()));
        }
        // -------- end : put entry in Old_bids


        // ******** start : process individual Bid_amount entry
        List<Bid_amount> bidAmountList = new ArrayList<>();

        try {
            bidAmountList = bidAmountRepo.findAllByBid_id(expiredBidItemObj.getBid_id());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_amount Db-table | in bulkBidItemSellSupportIndividualItemUpdate",HttpStatus.BAD_REQUEST.value()));
        }

        for(Bid_amount bidAmountObj : bidAmountList) {

            ResponseEntity<Object> individualBidAmountResponse = bulkBidItemSellSupportUpdateFromBidAmount(bidAmountObj, expiredBidItemObj);

            if (individualBidAmountResponse != null && individualBidAmountResponse.getBody() != null) {
                GeneralErrorDto errorDto = (GeneralErrorDto) individualBidAmountResponse.getBody();
                if(errorDto.getError()) return individualBidAmountResponse;
            }
        }

        // -------- end : process individual Bid_amount entry

        // ******** start : add winnning money to bid hoster + broadcast

        if(expiredBidItemObj.getHighest_bid()!=null) {
            Local_user_details sellerLocalUserDetails = null;

            try {
                sellerLocalUserDetails = localUserDetailsRepo.findByEmail(expiredBidItemObj.getSell_user_email());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new GeneralErrorDto(true,"Error in Local_user_details Db-table | in bulkBidItemSellSupportIndividualItemUpdate",HttpStatus.BAD_REQUEST.value()));
            }

            if(sellerLocalUserDetails!=null ) {
                Long newProfitAmount = sellerLocalUserDetails.getBalance_amount() + expiredBidItemObj.getHighest_bid();
                sellerLocalUserDetails.setBalance_amount(newProfitAmount);

                try {
                    localUserDetailsRepo.save(sellerLocalUserDetails);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.OK)
                            .body(new GeneralErrorDto(true,"Error in Local_user_details Db-table | in bulkBidItemSellSupportIndividualItemUpdate",HttpStatus.BAD_REQUEST.value()));
                }

                BroadcastBalanceAmountResponseDto broadCastMsg = new BroadcastBalanceAmountResponseDto(sellerLocalUserDetails.getBalance_amount(), sellerLocalUserDetails.getEmail());
                personalDetailsWebsocketController.doPersonalDetailsBroadcast(broadCastMsg, sellerLocalUserDetails.getEmail());
            }
        }
        // --------- end : add winnning money to bid hoster + broadcast


        // ******** start : delete operations

        //delete item from Bid_item
        try {
            bidItemRepo.deleteById(expiredBidItemObj.getBid_id());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in bulkBidItemSellSupportIndividualItemUpdate",HttpStatus.BAD_REQUEST.value()));
        }

        // delete all entries from Bid_chat
        try {
            bidChatRepo.deleteAllbyBid_id(expiredBidItemObj.getBid_id());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_chat Db-table | in bulkBidItemSellSupportIndividualItemUpdate",HttpStatus.BAD_REQUEST.value()));
        }

        // delete all entries from Bid_amount
        try {
            bidAmountRepo.deleteAllbyBid_id(expiredBidItemObj.getBid_id());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_amount Db-table | in bulkBidItemSellSupportIndividualItemUpdate",HttpStatus.BAD_REQUEST.value()));
        }

        // -------- end : delete operations

        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(false,"All success from bulkBidItemSellSupportIndividualItemUpdate",HttpStatus.OK.value()));
    }


    public ResponseEntity<Object> bulkBidItemSellSupportUpdateFromBidAmount(Bid_amount bidAmountObj, Bid_item expiredBidItemObj) {

        // ************** start : update wallet balance + broadcast
        Local_user_details localUserDetails = null;

        try {
            localUserDetails = localUserDetailsRepo.findByEmail(bidAmountObj.getPurchase_user_email());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Local_user_details Db-table | in bulkBidItemSellSupportUpdateFromBidAmount",HttpStatus.BAD_REQUEST.value()));
        }

        if(localUserDetails!=null) {

            // winning logic
            if(expiredBidItemObj.getHighest_bid_person_email()!=null &&
                    bidAmountObj.getPurchase_user_email().equals(expiredBidItemObj.getHighest_bid_person_email())) {

                // no money updates, because he won

            }
            else if(expiredBidItemObj.getHighest_bid_person_email()!=null &&
                    !bidAmountObj.getPurchase_user_email().equals(expiredBidItemObj.getHighest_bid_person_email())) {

                // if lost bid, then refund money + Broadcast balance amount
                Long newAmount = (localUserDetails.getBalance_amount() + bidAmountObj.getTotal_amount_spent());
                localUserDetails.setBalance_amount(newAmount);

                try {
                    localUserDetailsRepo.save(localUserDetails);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.OK)
                            .body(new GeneralErrorDto(true,"Error in Local_user_details Db-table | in bulkBidItemSellSupportUpdateFromBidAmount",HttpStatus.BAD_REQUEST.value()));
                }

                BroadcastBalanceAmountResponseDto broadCastMsg = new BroadcastBalanceAmountResponseDto(localUserDetails.getBalance_amount(), bidAmountObj.getPurchase_user_email());
                personalDetailsWebsocketController.doPersonalDetailsBroadcast(broadCastMsg, bidAmountObj.getPurchase_user_email());

            }
        }
        // ------------- end : update wallet balance + broadcast

        // ************** start : populate MY bids inventory (history) + redis-stream

        RedisInventoryServiceMyBidHistoryInsertRequestDto redisMyBidHistoryObj = RedisInventoryServiceMyBidHistoryInsertRequestDto.builder()
                .bidder_user_email(bidAmountObj.getPurchase_user_email())
                .bidder_total_amount_spent(bidAmountObj.getTotal_amount_spent())
                .bid_won(false) //still yet to decide
                .bid_id(expiredBidItemObj.getBid_id())
                .sell_user_email(expiredBidItemObj.getSell_user_email())
                .sell_user_name(expiredBidItemObj.getSell_user_name())
                .purchase_user_email(expiredBidItemObj.getHighest_bid_person_email())
                .purchase_user_name(expiredBidItemObj.getHighest_bid_person())
                .purchase_price(expiredBidItemObj.getHighest_bid())
                .item_image_url(expiredBidItemObj.getItem_image_url())
                .item_name(expiredBidItemObj.getItem_name())
                .item_description(expiredBidItemObj.getItem_description())
                .item_price(expiredBidItemObj.getItem_price())
                .bid_start_date_time(expiredBidItemObj.getPost_date_time())
                .bid_end_date_time(expiredBidItemObj.getEnd_date_time())
                .build();

        //winning bid logic
        if(expiredBidItemObj.getHighest_bid_person_email()!=null &&
                bidAmountObj.getPurchase_user_email().equals(expiredBidItemObj.getHighest_bid_person_email())) {
            redisMyBidHistoryObj.setBid_won(true);
        }

        //redis-streams call
        try {
            producerService.sendInventoryEvent(redisMyBidHistoryObj);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in redis producerService | in bulkBidItemSellSupportUpdateFromBidAmount",HttpStatus.BAD_REQUEST.value()));
        }

        // ************** end : populate MY bids inventory (history) + redis-stream


        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(false,"All success from bulkBidItemSellSupportUpdateFromBidAmount",HttpStatus.OK.value()));
    }


    public ResponseEntity<Object> toForceEndBid(ToForceEndBidRequestDto requestDto) {

        if(requestDto.getBid_id()==null || requestDto.getUser_email()==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Few fields are missing", HttpStatus.BAD_REQUEST.value()));
        }

        Bid_item bidItem = null;

        try {
            bidItem = bidItemRepo.findById(requestDto.getBid_id()).orElse(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in toForceEndBid",HttpStatus.BAD_REQUEST.value()));
        }

        if(bidItem==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"No item was found with the requested bid_id",HttpStatus.BAD_REQUEST.value()));
        }

        if(!bidItem.getSell_user_email().equals(requestDto.getUser_email())) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Cannot sell because you are not the owner of the bid",HttpStatus.BAD_REQUEST.value()));
        }

        bidItem.setEnd_date_time(System.currentTimeMillis());

        try {
            bidItemRepo.save(bidItem);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in toForceEndBid",HttpStatus.BAD_REQUEST.value()));
        }

        bulkBidItemSell();

        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(false,"Successfully closed the Bid",HttpStatus.OK.value()));
    }

    public ResponseEntity<Object> getMyBidsList(String mode, OnlyEmailRequestDto requestDto) {

        if(mode==null || requestDto.getUser_email()==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Few fields are missing", HttpStatus.BAD_REQUEST.value()));
        }

        String userEmail = requestDto.getUser_email();

        if(mode.equals("live")) {
            List<Bid_item> activeBidList = new ArrayList<>();

            try {
                activeBidList = bidItemRepo.findAllBySellerEmail(userEmail);

                activeBidList.sort(
                        Comparator.comparing(Bid_item::getEnd_date_time).reversed()
                );
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in getMyBidsList",HttpStatus.BAD_REQUEST.value()));
            }

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralGetMyBidsListResponseDto<Bid_item>(false,"Successfully fetched Active bids",HttpStatus.OK.value(), activeBidList));
        }

        if(mode.equals("old")) {
            List<Old_bids> oldBidList = new ArrayList<>();

            try {
                oldBidList = bidHistoryRepo.findAllBySellerEmail(userEmail);

                oldBidList.sort(
                        Comparator.comparing(Old_bids::getBid_end_date_time).reversed()
                );
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new GeneralErrorDto(true,"Error in Old_bids Db-table | in getMyBidsList",HttpStatus.BAD_REQUEST.value()));
            }

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralGetMyBidsListResponseDto<Old_bids>(false,"Successfully fetched Old bids",HttpStatus.OK.value(), oldBidList));
        }

        if(mode.equals("won")) {
            List<My_bids_history> wonBidsList = new ArrayList<>();

            try {
                wonBidsList = myBidsHistoryRepo.findAllByBidderEmailAndWon(userEmail, true);

                wonBidsList.sort(
                        Comparator.comparing(My_bids_history::getBid_end_date_time).reversed()
                );
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new GeneralErrorDto(true,"Error in My_bids_history Db-table | in getMyBidsList",HttpStatus.BAD_REQUEST.value()));
            }

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralGetMyBidsListResponseDto<My_bids_history>(false,"Successfully fetched Won Auctions",HttpStatus.OK.value(), wonBidsList));
        }

        if(mode.equals("lost")) {
            List<My_bids_history> lostBidsList = new ArrayList<>();

            try {
                lostBidsList = myBidsHistoryRepo.findAllByBidderEmailAndWon(userEmail, false);

                lostBidsList.sort(
                        Comparator.comparing(My_bids_history::getBid_end_date_time).reversed()
                );
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new GeneralErrorDto(true,"Error in My_bids_history Db-table | in getMyBidsList",HttpStatus.BAD_REQUEST.value()));
            }

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralGetMyBidsListResponseDto<My_bids_history>(false,"Successfully fetched lost Auctions",HttpStatus.OK.value(), lostBidsList));
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(true,"Select some appropriate mode type",HttpStatus.BAD_REQUEST.value()));
    }

    //  *************** start : test services

    public ResponseEntity<Object> deleteBid(Long bid_id) {

        if(bid_id==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Few fields are missing", HttpStatus.BAD_REQUEST.value()));
        }

        Bid_item bidItem = null;

        try {
            bidItem = bidItemRepo.findById(bid_id).orElse(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in deleteBid",HttpStatus.BAD_REQUEST.value()));
        }

        if(bidItem==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Bid does not exists",HttpStatus.BAD_REQUEST.value()));
        }

        if(bidItem.getItem_image_url().equals(generalImageUnavailable)==false) {
            try {
                imageUploadService.deleteImageByUrl(bidItem.getItem_image_url());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new GeneralErrorDto(true,"Error in cloudinaryService-deleteByUrl | in deleteBid",HttpStatus.BAD_REQUEST.value()));
            }
        }

        try {
            bidItemRepo.deleteById(bid_id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in deleteBid",HttpStatus.BAD_REQUEST.value()));
        }

        ResponseEntity<Object> generalUpdateDecsionObj = doGeneralUpdateWebsocketBroadcastInBiddingService();
        if(generalUpdateDecsionObj!=null) return generalUpdateDecsionObj;


        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(false,"Successfully deleted the Bid",HttpStatus.OK.value()));
    }

    public ResponseEntity<Object> getAllBidsList() {

        List<Bid_item> bidItemList =  null;

        try {
            bidItemList= bidItemRepo.findAll();

            bidItemList.sort(
                    Comparator.comparing(Bid_item::getPost_date_time).reversed()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in getAllBidsList",HttpStatus.BAD_REQUEST.value()));
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(GetAllBidsResponseDto.builder()
                        .error(false)
                        .bit_items_list(bidItemList)
                        .message("Successfully fetched all active bids")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    public ResponseEntity<Object> createSampleOldBid(CreateSampleOldBidRequestDto requestObj) {

        if(requestObj.getSell_user_email()==null || requestObj.getSell_user_name()==null || requestObj.getPurchase_user_name()==null
                || requestObj.getPurchase_user_email()==null || requestObj.getPurchase_price()==null || requestObj.getItem_image_url()==null
             || requestObj.getItem_name()==null || requestObj.getItem_description()==null || requestObj.getItem_price()==null
               || requestObj.getBid_end_date_time()==null || requestObj.getBid_end_date_time()==null ) {

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Few fields are missing", HttpStatus.BAD_REQUEST.value()));
        }

        Old_bids saveOldBid = Old_bids.builder()
                                    .bid_id(requestObj.getBid_id())
                                    .sell_user_email(requestObj.getSell_user_email())
                                    .sell_user_name(requestObj.getSell_user_name())
                                    .purchase_user_email(requestObj.getPurchase_user_email())
                                    .purchase_user_name(requestObj.getPurchase_user_name())
                                    .purchase_price(requestObj.getPurchase_price())
                                    .item_image_url(requestObj.getItem_image_url())
                                    .item_name(requestObj.getItem_name())
                                    .item_description(requestObj.getItem_description())
                                    .item_price(requestObj.getItem_price())
                                    .bid_start_date_time(requestObj.getBid_start_date_time())
                                    .bid_end_date_time(requestObj.getBid_end_date_time())
                                    .bid_end_date_time_for_dev_purpose(System.currentTimeMillis())
                                    .build();

        try {
            bidHistoryRepo.save(saveOldBid);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Old_bids Db-table | in createSampleOldBid",HttpStatus.BAD_REQUEST.value()));
        }


        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(false,"Successfully created old bid history",HttpStatus.OK.value()));
    }

    public ResponseEntity<Object> doGeneralUpdateBroadCaseWebsocket() {

        GeneralErrorDto obj = new GeneralErrorDto(false,"Hurray general update websocket worked", HttpStatus.BAD_REQUEST.value());

        biddingWebSocketController.doGeneralUpdateBroadcast(obj);

        return ResponseEntity.status(HttpStatus.OK)
                .body(obj);
    }

    @Transactional
    public ResponseEntity<Object> deleteEveryThingForABidId(Long bid_id) {

        //Bid_item, Bid_amount, Bid_chat, Old_bids, My_bids_history

        if(bid_id==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Few fields are missing", HttpStatus.BAD_REQUEST.value()));
        }

        // ******** start : delete in Bid_item

        Bid_item bidItem = null;

        try {
            bidItem = bidItemRepo.findById(bid_id).orElse(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_item Db-table | in deleteEveryThingForABidId",HttpStatus.BAD_REQUEST.value()));
        }

        if(bidItem!=null) {

            if (bidItem.getItem_image_url().equals(generalImageUnavailable) == false) {
                try {
                    imageUploadService.deleteImageByUrl(bidItem.getItem_image_url());
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.OK)
                            .body(new GeneralErrorDto(true, "Error in cloudinaryService-deleteByUrl | in deleteEveryThingForABidId", HttpStatus.BAD_REQUEST.value()));
                }
            }

            try {
                bidItemRepo.deleteById(bid_id);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new GeneralErrorDto(true, "Error in Bid_item Db-table | in deleteEveryThingForABidId", HttpStatus.BAD_REQUEST.value()));
            }
        }

        // --------- end : delete in Bid_item


        // ******** start : delete in Bid_amount

        try {
            bidAmountRepo.deleteAllbyBid_id(bid_id);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_amount Db-table | in deleteEveryThingForABidId",HttpStatus.BAD_REQUEST.value()));
        }
        // --------- end : delete in Bid_amount


        // ******** start : delete in Bid_chat

        try {
            bidChatRepo.deleteAllbyBid_id(bid_id);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Bid_chat Db-table | in deleteEveryThingForABidId",HttpStatus.BAD_REQUEST.value()));
        }

        // ---------- end : delete in Bid_chat

        // ********** start : delete in Old_bids

        Old_bids oldBidsObj = null;

        try {
            oldBidsObj = bidHistoryRepo.findByBid_id(bid_id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true,"Error in Old_bids Db-table | in deleteEveryThingForABidId",HttpStatus.BAD_REQUEST.value()));
        }

        if(oldBidsObj!=null) {

            if (oldBidsObj.getItem_image_url().equals(generalImageUnavailable) == false) {
                try {
                    imageUploadService.deleteImageByUrl(oldBidsObj.getItem_image_url());
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.OK)
                            .body(new GeneralErrorDto(true, "Error in cloudinaryService-deleteByUrl | in deleteEveryThingForABidId", HttpStatus.BAD_REQUEST.value()));
                }
            }

            try {
                bidHistoryRepo.deleteAllbyBid_id(bid_id);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new GeneralErrorDto(true, "Error in Old_bids Db-table | in deleteEveryThingForABidId", HttpStatus.BAD_REQUEST.value()));
            }
        }

        // ---------- end : delete in Old_bids

        // ******** start : delete all items from My_bids_history
        try {
            myBidsHistoryRepo.deleteAllbyBid_id(bid_id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Error in My_bids_history Db-table | in deleteEveryThingForABidId", HttpStatus.BAD_REQUEST.value()));
        }
        // -------- end : delete all items from My_bids_history

        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(false,"Deleting all done",HttpStatus.OK.value()));
    }

    public ResponseEntity<Object> apiConnectiontestFromMainService() {
        return inventoryControllerFeign.apiConnectiontestFromMainService();
    }

    public ResponseEntity<Object> redisStreamSimpleTest() {

        RedisInventoryServiceMyBidHistoryInsertRequestDto sampleObj = RedisInventoryServiceMyBidHistoryInsertRequestDto.builder()
                .item_description("sendong from mainservice -> redis -> inventory service")
                .build();

        try {
            producerService.sendInventoryEvent(sampleObj);
        } catch (Exception e) {
            System.out.println("REdisErrOR " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(false,"Someting got send",HttpStatus.OK.value()));
    }

    // -------------- end : test services
}


