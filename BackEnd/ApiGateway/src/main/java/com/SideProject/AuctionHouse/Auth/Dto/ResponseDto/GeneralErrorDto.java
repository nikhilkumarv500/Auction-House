package com.SideProject.AuctionHouse.Auth.Dto.ResponseDto;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class GeneralErrorDto {
    public Boolean error;
    public String message;
    public Integer statusCode;
}
