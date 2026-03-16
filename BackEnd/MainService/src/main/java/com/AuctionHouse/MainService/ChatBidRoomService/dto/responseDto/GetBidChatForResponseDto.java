package com.AuctionHouse.MainService.ChatBidRoomService.dto.responseDto;

import com.AuctionHouse.MainService.ChatBidRoomService.entity.Bid_chat;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GetBidChatForResponseDto {
    public Boolean error;
    public String message;
    public Integer statusCode;
    public List<Bid_chat> bidChatList;
}
