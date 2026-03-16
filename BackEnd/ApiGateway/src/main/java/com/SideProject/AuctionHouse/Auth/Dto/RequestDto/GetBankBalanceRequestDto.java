package com.SideProject.AuctionHouse.Auth.Dto.RequestDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GetBankBalanceRequestDto {
    String email;
}
