package com.AuctionHouse.MainService.BiddingService.Dto.ResponseDto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class GeneralGetMyBidsListResponseDto<T> {
    public Boolean error;
    public String message;
    public Integer statusCode;

    public List<T> fullDisplayList;
}
