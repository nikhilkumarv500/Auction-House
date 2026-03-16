package com.AuctionHouse.MainService.BiddingService.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Bid_item {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long bid_id;

    private Long post_date_time;

    private String sell_user_email;

    private String sell_user_name;

    private String item_image_url;

    private String item_name;

    private Long item_price;

    private String item_description;

    private Boolean sold;

    private Long end_date_time;

    private Long highest_bid;

    private String highest_bid_person;

    private String highest_bid_person_email;

}
