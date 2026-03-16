package com.AuctionHouse.MainService.BiddingService.feign;

import com.AuctionHouse.MainService.config.feing.GeneralFeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name="${feign.inventoryservice.project.name}", configuration = GeneralFeignConfig.class)
public interface InventoryControllerFeign {

    @GetMapping("/apiConnectiontestFromMainService")
    public ResponseEntity<Object> apiConnectiontestFromMainService();

}
