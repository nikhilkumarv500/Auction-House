package com.AuctionHouse.MainService.BiddingService.repo;


import com.AuctionHouse.MainService.BiddingService.entity.My_bids_history;
import com.AuctionHouse.MainService.BiddingService.entity.Old_bids;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface My_bids_history_repo extends JpaRepository<My_bids_history, Long> {

    @Transactional
    @Modifying
    @Query("DELETE FROM My_bids_history b WHERE b.bid_id = :bidId")
    void deleteAllbyBid_id(@Param("bidId") Long bidId);

    @Query("SELECT b FROM My_bids_history b WHERE b.bidder_user_email = :bidderEmail AND b.bid_won = :won")
    List<My_bids_history> findAllByBidderEmailAndWon(@Param("bidderEmail") String bidderEmail,@Param("won") Boolean won);

}
