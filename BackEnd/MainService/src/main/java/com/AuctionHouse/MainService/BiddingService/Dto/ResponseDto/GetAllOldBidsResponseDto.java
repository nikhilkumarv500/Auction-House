package com.AuctionHouse.MainService.BiddingService.Dto.ResponseDto;

import com.AuctionHouse.MainService.BiddingService.entity.Bid_item;
import com.AuctionHouse.MainService.BiddingService.entity.Old_bids;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GetAllOldBidsResponseDto {

    public Boolean error;
    public String message;
    public Integer statusCode;

    public List<Old_bids> old_bid_items_list;
}
