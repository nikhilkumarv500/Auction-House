package com.SideProject.AuctionHouse.Auth.Dto.ResponseDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class AddMoneyToWalletResponseDto {
    public Boolean error;
    public String message;
    public Integer statusCode;
    public Long balance_amount;

}
