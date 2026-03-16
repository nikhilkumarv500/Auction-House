package com.SideProject.AuctionHouse.Gateway.InventoryService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("apigateway")
public class InventoryController {

    @Autowired
    InventoryControllerFeign inventoryControllerFeign;


    @GetMapping("/inventory/apiConnectiontest")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> apiConnectiontest() {
        ResponseEntity<Object> response = inventoryControllerFeign.apiConnectiontest();

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }


}
