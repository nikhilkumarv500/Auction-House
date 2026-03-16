package com.AuctionHouse.MainService.ChatBidRoomService.entity;

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
public class Bid_chat {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long chat_id;

    private Long bid_id;

    private Long msg_post_date_time;

    private String purchase_user_email;

    private String purchase_user_name;

    private Long purchase_price;

}
