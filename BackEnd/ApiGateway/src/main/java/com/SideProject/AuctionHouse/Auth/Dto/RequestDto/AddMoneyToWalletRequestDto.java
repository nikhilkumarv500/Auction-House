package com.SideProject.AuctionHouse.Auth.Dto.RequestDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class AddMoneyToWalletRequestDto {
    String user_email;
    Long amount;
}
