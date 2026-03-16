package com.AuctionHouse.MainService.config.jwtConfig.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Email_password {
    @Id
    private String email;
    private String password;
    private String role;
}
