package com.SideProject.AuctionHouse.Auth.Dto.RequestDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RegisterRequestDto {
    private String email;
    private String password;
    private String role;
    private String name;
}
