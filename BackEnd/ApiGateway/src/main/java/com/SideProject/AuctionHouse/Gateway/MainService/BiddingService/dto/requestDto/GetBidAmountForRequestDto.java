package com.SideProject.AuctionHouse.Gateway.MainService.BiddingService.dto.requestDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GetBidAmountForRequestDto {
    public String user_email;
    public Long bid_id;
}
