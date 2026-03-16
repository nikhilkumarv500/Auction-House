package com.AuctionHouse.MainService.ChatBidRoomService.dto.requestDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CreateBidChatRequestDto {
    private Long bid_id;

    private String purchase_user_email;

    private String purchase_user_name;

    private Long purchase_price;
}
