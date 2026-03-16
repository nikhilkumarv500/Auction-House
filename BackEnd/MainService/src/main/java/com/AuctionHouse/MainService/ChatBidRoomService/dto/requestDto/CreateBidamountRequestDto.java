package com.AuctionHouse.MainService.ChatBidRoomService.dto.requestDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CreateBidamountRequestDto {
    private Long bid_id;

    private String purchase_user_email;

    private Long total_amount_spent;
}
