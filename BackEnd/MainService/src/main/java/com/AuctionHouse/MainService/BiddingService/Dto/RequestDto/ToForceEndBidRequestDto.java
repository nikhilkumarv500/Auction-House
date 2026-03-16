package com.AuctionHouse.MainService.BiddingService.Dto.RequestDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class ToForceEndBidRequestDto {

    private Long bid_id;
    private String user_email;
}
