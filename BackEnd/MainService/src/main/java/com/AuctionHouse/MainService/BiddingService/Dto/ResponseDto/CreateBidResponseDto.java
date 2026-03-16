package com.AuctionHouse.MainService.BiddingService.Dto.ResponseDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CreateBidResponseDto {

    public Boolean error;
    public String message;
    public Integer statusCode;

    public Long balance_amount;
}
