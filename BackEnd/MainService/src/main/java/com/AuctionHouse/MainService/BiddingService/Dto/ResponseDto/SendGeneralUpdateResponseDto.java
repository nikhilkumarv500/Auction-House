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
public class SendGeneralUpdateResponseDto {

    public List<Bid_item> activeBidItemList;

    public List<Old_bids> oldBidItemList;

}
