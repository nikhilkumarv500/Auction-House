package com.SideProject.AuctionHouse.Auth.Dto.ResponseDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GetBankBalanceResponseDto {
    public Long balance_amount;
}
