package com.AuctionHouse.InventoryService.generalDto.requestDto;
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
