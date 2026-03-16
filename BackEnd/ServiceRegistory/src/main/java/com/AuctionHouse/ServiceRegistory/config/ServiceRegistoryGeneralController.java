package com.AuctionHouse.ServiceRegistory.config;

import com.AuctionHouse.ServiceRegistory.generalDto.responseDto.GeneralErrorDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class ServiceRegistoryGeneralController {

    @GetMapping("/checkServiceRegistoryAlive")
    public ResponseEntity<GeneralErrorDto> checkApigatewayAlive() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new GeneralErrorDto(false, "Service Registory server is running now!", HttpStatus.OK.value()));
    }

}
