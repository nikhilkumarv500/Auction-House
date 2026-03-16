package com.SideProject.AuctionHouse.Auth.controller;

import com.SideProject.AuctionHouse.Auth.Dto.RequestDto.*;
import com.SideProject.AuctionHouse.Auth.Dto.ResponseDto.GeneralErrorDto;
import com.SideProject.AuctionHouse.Auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserService service;


    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequestDto user) {
        return service.register(user);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequestDto user) {
        return service.login(user);
    }

    @GetMapping("/checkApigatewayAlive")
    public ResponseEntity<GeneralErrorDto> checkApigatewayAlive() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new GeneralErrorDto(false, "Api gateway server is running now!", HttpStatus.OK.value()));
    }

    @GetMapping("/checkjwt")
    public ResponseEntity<Object> checkJwt() {
        return service.checkJwt();
    }

    @PostMapping("/getBankBalance")
    public ResponseEntity<Object> getBankBalance(@RequestBody GetBankBalanceRequestDto requestDto) {
        return service.getBankBalance(requestDto);
    }

    @PostMapping("/admin/resetPasswordAsAdmin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> resetPasswordAsAdmin(@RequestBody ResetPasswordRequestDto requestDto) {
        return service.resetPasswordAsAdmin(requestDto);
    }

    @PostMapping("/addMoneyToWallet")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Object> addMoneyToWallet(@RequestBody AddMoneyToWalletRequestDto requestDto) {
        return service.addMoneyToWallet(requestDto);
    }
}
