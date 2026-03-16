package com.SideProject.AuctionHouse.Auth.Dto.RequestDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class LoginRequestDto {
    private String email;
    private String password;
}
