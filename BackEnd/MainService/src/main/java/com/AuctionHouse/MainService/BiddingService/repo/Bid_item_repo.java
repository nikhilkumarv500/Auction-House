package com.AuctionHouse.MainService.BiddingService.repo;

import com.AuctionHouse.MainService.BiddingService.entity.Bid_item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Bid_item_repo extends JpaRepository<Bid_item, Long> {

    @Query("SELECT b FROM Bid_item b WHERE b.sold = false")
    List<Bid_item> getNotSoldBids();

    @Query("SELECT b FROM Bid_item b WHERE b.sell_user_email = :sellerEmail")
    List<Bid_item> findAllBySellerEmail(@Param("sellerEmail") String sellerEmail);

}
