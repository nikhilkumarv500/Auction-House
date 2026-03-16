package com.AuctionHouse.InventoryService.generalController;

import com.AuctionHouse.InventoryService.generalDto.requestDto.GeneralErrorDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class InventoryServiceGeneralController {

    @GetMapping("/checkInventoryServiceAlive")
    public ResponseEntity<Object> checkApigatewayAlive() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new GeneralErrorDto(false, "Main service is running now!", HttpStatus.OK.value()));
    }

    @GetMapping("/apiConnectiontest")
    public ResponseEntity<Object> apiConnectiontest() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new GeneralErrorDto(false, "apigateway -> inventory_service : Inventory Service", HttpStatus.OK.value()));
    }

    @GetMapping("/apiConnectiontestFromMainService")
    public ResponseEntity<Object> apiConnectiontestFromMainService() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new GeneralErrorDto(false, "apigateway -> mainservice -> inventory_service : Inventory Service", HttpStatus.OK.value()));
    }
}
