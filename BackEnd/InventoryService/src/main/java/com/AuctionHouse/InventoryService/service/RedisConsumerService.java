package com.AuctionHouse.InventoryService.service;
import com.AuctionHouse.InventoryService.MyInventoryService.dto.requestDto.RedisInventoryServiceMyBidHistoryInsertRequestDto;
import com.AuctionHouse.InventoryService.MyInventoryService.service.MyInvertoryServiceApiService;
import com.AuctionHouse.InventoryService.generalDto.requestDto.GeneralErrorDto;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.*;

@Service
public class RedisConsumerService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${app.redis.stream}")
    private String stream;

    private String lastId = "0-0";

    @Autowired
    MyInvertoryServiceApiService myInvertoryServiceApiService;

    @PostConstruct
    public void startListening() {

        new Thread(() -> {

            while (true) {

                try {

                    List<MapRecord<String, Object, Object>> messages =
                            redisTemplate.opsForStream()
                                    .read(StreamOffset.create(stream, ReadOffset.from(lastId)));

                    if (messages != null) {

                        for (MapRecord<String, Object, Object> msg : messages) {

                            lastId = msg.getId().getValue();

                            String json = (String) msg.getValue().get("event");

                            RedisInventoryServiceMyBidHistoryInsertRequestDto event =
                                    objectMapper.readValue(json, RedisInventoryServiceMyBidHistoryInsertRequestDto.class);

                            if(event.getBid_won()==null && event.getItem_name()==null && event.getPurchase_price()==null) {
                                System.out.println("EVENT RECEIVED → " + event.getItem_description());
                            } else {
                                myInvertoryServiceApiService.insertIntoMyBidHistory_redis(event);
                            }

                            // DELETE MESSAGE AFTER PROCESSING
                            redisTemplate.opsForStream().delete(stream, msg.getId());
                        }

                    }

                    Thread.sleep(2000);

                } catch (Exception e) {
                    e.printStackTrace();
                }

            }

        }).start();
    }
}