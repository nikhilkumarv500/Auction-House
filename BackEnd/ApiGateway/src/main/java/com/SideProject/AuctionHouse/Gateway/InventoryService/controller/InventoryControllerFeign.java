package com.SideProject.AuctionHouse.Gateway.InventoryService.controller;

import com.SideProject.AuctionHouse.Auth.Dto.ResponseDto.GeneralErrorDto;
import com.SideProject.AuctionHouse.Gateway.config.GeneralFeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name="${feign.inventoryservice.project.name}", configuration = GeneralFeignConfig.class)
public interface InventoryControllerFeign {

    @GetMapping("/apiConnectiontest")
    public ResponseEntity<Object> apiConnectiontest();

}
