package com.SideProject.AuctionHouse.Auth.Dto.ResponseDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RegisterSuccessDto {
    public Boolean error;
    public String message;
    public Integer statusCode;
}
