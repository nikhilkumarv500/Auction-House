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
public class Bid_amount {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long bid_amount_id;

    private Long bid_id;

    private String purchase_user_email;

    private Long total_amount_spent;
}
