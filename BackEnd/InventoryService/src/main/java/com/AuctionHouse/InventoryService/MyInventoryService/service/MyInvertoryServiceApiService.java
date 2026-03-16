package com.AuctionHouse.InventoryService.MyInventoryService.service;

import com.AuctionHouse.InventoryService.MyInventoryService.dto.requestDto.RedisInventoryServiceMyBidHistoryInsertRequestDto;
import com.AuctionHouse.InventoryService.MyInventoryService.entity.My_bids_history;
import com.AuctionHouse.InventoryService.MyInventoryService.repo.My_bids_history_repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyInvertoryServiceApiService {

    @Autowired
    My_bids_history_repo myBidsHistoryRepo;

    public void insertIntoMyBidHistory_redis(RedisInventoryServiceMyBidHistoryInsertRequestDto requestDto) {

        My_bids_history newMyBidsHistoryObj = My_bids_history.builder()
                .bidder_user_email(requestDto.getBidder_user_email())
                .bidder_total_amount_spent(requestDto.getBidder_total_amount_spent())
                .bid_won(requestDto.getBid_won())
                .bid_id(requestDto.getBid_id())
                .sell_user_email(requestDto.getSell_user_email())
                .sell_user_name(requestDto.getSell_user_name())
                .purchase_user_email(requestDto.getPurchase_user_email())
                .purchase_user_name(requestDto.getPurchase_user_name())
                .purchase_price(requestDto.getPurchase_price())
                .item_image_url(requestDto.getItem_image_url())
                .item_name(requestDto.getItem_name())
                .item_description(requestDto.getItem_description())
                .item_price(requestDto.getItem_price())
                .bid_start_date_time(requestDto.getBid_start_date_time())
                .bid_end_date_time(requestDto.getBid_end_date_time())
                .build();

        try {
            myBidsHistoryRepo.save(newMyBidsHistoryObj);
        } catch (Exception e) {
            System.out.println("Error in My_bids_history | in insertIntoMyBidHistory_redis" + e.getMessage());
        }
    }


}
