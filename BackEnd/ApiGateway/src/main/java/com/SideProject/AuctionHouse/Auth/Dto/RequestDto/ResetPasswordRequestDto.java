package com.SideProject.AuctionHouse.Auth.Dto.RequestDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ResetPasswordRequestDto {
    private String user_email;
    private String user_password;
}
