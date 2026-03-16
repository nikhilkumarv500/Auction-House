package com.AuctionHouse.MainService.BiddingService.redisProducer;

import com.AuctionHouse.MainService.BiddingService.Dto.RequestDto.RedisInventoryServiceMyBidHistoryInsertRequestDto;
import com.AuctionHouse.MainService.BiddingService.Dto.ResponseDto.GeneralErrorDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.connection.RedisStreamCommands;
import org.springframework.data.redis.connection.stream.*;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.*;

@Service
public class RedisProducerService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${app.redis.stream}")
    private String stream;

    public void sendInventoryEvent(RedisInventoryServiceMyBidHistoryInsertRequestDto event) throws Exception {

        String json = objectMapper.writeValueAsString(event);

        Map<String, Object> map = new HashMap<>();
        map.put("event", json);

        RecordId id = redisTemplate.opsForStream().add(
                StreamRecords.mapBacked(map)
                        .withStreamKey(stream),
                RedisStreamCommands.XAddOptions.maxlen(1000).approximateTrimming(true)
        );

        System.out.println("EVENT SENT TO STREAM: " + stream);
    }
}
