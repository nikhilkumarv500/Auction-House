package com.AuctionHouse.MainService.config;

import com.AuctionHouse.MainService.BiddingService.Dto.ResponseDto.GeneralErrorDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class MainServiceGeneralController {

    @GetMapping("/checkMainServiceAlive")
    public ResponseEntity<GeneralErrorDto> checkApigatewayAlive() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new GeneralErrorDto(false, "Main service is running now!", HttpStatus.OK.value()));
    }
}
