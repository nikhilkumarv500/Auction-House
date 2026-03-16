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
public class Old_bids {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long bid_history_id;

    private Long bid_id;

    private String sell_user_email;

    private String sell_user_name;

    private String purchase_user_email;

    private String purchase_user_name;

    private Long purchase_price;

    private String item_image_url;

    private String item_name;

    private String item_description;

    private Long item_price;

    private Long bid_start_date_time;

    private Long bid_end_date_time;

    private Long bid_end_date_time_for_dev_purpose;

}
