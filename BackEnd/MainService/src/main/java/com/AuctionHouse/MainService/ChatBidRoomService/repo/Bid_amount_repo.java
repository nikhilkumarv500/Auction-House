package com.AuctionHouse.MainService.ChatBidRoomService.repo;

import com.AuctionHouse.MainService.ChatBidRoomService.entity.Bid_amount;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Bid_amount_repo extends JpaRepository<Bid_amount, Long> {

    @Query("SELECT b FROM Bid_amount b WHERE b.purchase_user_email = :userEmail and b.bid_id = :bidId")
    Bid_amount findByPurchase_user_email_and_bid_id(@Param("userEmail") String userEmail,@Param("bidId") Long bidId);

    @Query("SELECT b FROM Bid_amount b WHERE b.bid_id = :bidId")
    List<Bid_amount> findAllByBid_id(@Param("bidId") Long bidId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Bid_amount b WHERE b.bid_id = :bidId")
    void deleteAllbyBid_id(@Param("bidId") Long bidId);
}
