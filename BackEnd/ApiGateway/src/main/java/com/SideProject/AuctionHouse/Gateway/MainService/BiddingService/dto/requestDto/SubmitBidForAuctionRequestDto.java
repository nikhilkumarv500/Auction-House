package com.SideProject.AuctionHouse.Gateway.MainService.BiddingService.dto.requestDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SubmitBidForAuctionRequestDto {
    private Long bid_id;
    private String purchase_user_email;
    private String purchase_user_name;
    private Long purchase_price;
}
