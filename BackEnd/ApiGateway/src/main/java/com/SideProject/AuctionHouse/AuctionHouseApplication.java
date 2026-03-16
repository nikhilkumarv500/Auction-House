package com.SideProject.AuctionHouse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AuctionHouseApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuctionHouseApplication.class, args);
    }

}
