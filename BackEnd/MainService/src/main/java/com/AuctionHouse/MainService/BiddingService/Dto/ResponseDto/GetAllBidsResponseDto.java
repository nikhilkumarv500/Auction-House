package com.AuctionHouse.MainService.BiddingService.Dto.ResponseDto;

import com.AuctionHouse.MainService.BiddingService.entity.Bid_item;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GetAllBidsResponseDto {

    public Boolean error;
    public String message;
    public Integer statusCode;

    public List<Bid_item> bit_items_list;
}
