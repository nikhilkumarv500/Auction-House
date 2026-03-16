package com.AuctionHouse.ServiceRegistory.generalDto.responseDto;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GeneralErrorDto {
    public Boolean error;
    public String message;
    public Integer statusCode;
}
