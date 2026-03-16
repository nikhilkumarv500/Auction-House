package com.AuctionHouse.MainService.ChatBidRoomService.dto.responseDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SubmitBidForAuctionResponseDto {
    public Boolean error;
    public String message;
    public Integer statusCode;
    public Long balance_amount;
    public Long user_highest_auction_bid;
}
