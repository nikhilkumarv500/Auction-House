package com.AuctionHouse.MainService.BiddingService.repo;

import com.AuctionHouse.MainService.BiddingService.entity.Bid_item;
import com.AuctionHouse.MainService.BiddingService.entity.Old_bids;
import com.AuctionHouse.MainService.ChatBidRoomService.entity.Bid_amount;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Old_bid_repo extends JpaRepository<Old_bids, Long> {

    @Query("SELECT b FROM Old_bids b WHERE b.bid_id = :bidId")
    Old_bids findByBid_id(@Param("bidId") Long bidId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Old_bids b WHERE b.bid_id = :bidId")
    void deleteAllbyBid_id(@Param("bidId") Long bidId);


    @Query("SELECT b FROM Old_bids b WHERE b.sell_user_email = :sellerEmail")
    List<Old_bids> findAllBySellerEmail(@Param("sellerEmail") String sellerEmail);
}
