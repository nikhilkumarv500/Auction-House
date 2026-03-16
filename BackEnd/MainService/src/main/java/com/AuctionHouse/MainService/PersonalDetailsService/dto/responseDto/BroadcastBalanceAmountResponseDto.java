package com.AuctionHouse.MainService.PersonalDetailsService.dto.responseDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class BroadcastBalanceAmountResponseDto {
    private Long balance_amount;
    private String user_email;
}
