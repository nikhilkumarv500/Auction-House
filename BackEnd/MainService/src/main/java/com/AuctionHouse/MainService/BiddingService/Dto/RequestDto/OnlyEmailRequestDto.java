package com.AuctionHouse.MainService.BiddingService.Dto.RequestDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class OnlyEmailRequestDto {
    private String user_email;
}
