package com.SideProject.AuctionHouse.Auth.Dto.ResponseDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class LoginSuccessDto {
    public Boolean error;
    public String message;
    public Integer statusCode;
    public String jwtToken;
    public String name;
    public String email;
    public Long balance_amount;
}
