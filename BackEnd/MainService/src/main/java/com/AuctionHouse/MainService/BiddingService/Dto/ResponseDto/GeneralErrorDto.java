package com.AuctionHouse.MainService.BiddingService.Dto.ResponseDto;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GeneralErrorDto {
    public Boolean error;
    public String message;
    public Integer statusCode;
}
