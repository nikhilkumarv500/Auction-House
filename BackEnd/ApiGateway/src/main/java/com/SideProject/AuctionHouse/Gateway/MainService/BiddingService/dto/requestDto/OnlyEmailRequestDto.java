package com.SideProject.AuctionHouse.Gateway.MainService.BiddingService.dto.requestDto;

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
