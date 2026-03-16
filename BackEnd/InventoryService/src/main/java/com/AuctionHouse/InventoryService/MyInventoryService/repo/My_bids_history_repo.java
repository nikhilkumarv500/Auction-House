package com.AuctionHouse.InventoryService.MyInventoryService.repo;

import com.AuctionHouse.InventoryService.MyInventoryService.entity.My_bids_history;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface My_bids_history_repo extends JpaRepository<My_bids_history, Long> {

    @Modifying
    @Query("DELETE FROM My_bids_history b WHERE b.bid_id = :bidId")
    void deleteAllbyBid_id(@Param("bidId") Long bidId);

}
