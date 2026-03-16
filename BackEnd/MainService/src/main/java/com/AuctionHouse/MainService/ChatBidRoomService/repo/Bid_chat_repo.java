package com.AuctionHouse.MainService.ChatBidRoomService.repo;

import com.AuctionHouse.MainService.ChatBidRoomService.entity.Bid_chat;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Bid_chat_repo extends JpaRepository<Bid_chat, Long> {

    @Query("SELECT b FROM Bid_chat b WHERE b.bid_id = :bidId")
    List<Bid_chat> findAllByBid_id(@Param("bidId") Long bidId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Bid_chat b WHERE b.bid_id = :bidId")
    void deleteAllbyBid_id(@Param("bidId") Long bidId);
}
