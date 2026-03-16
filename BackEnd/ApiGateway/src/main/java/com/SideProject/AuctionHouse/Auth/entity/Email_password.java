package com.SideProject.AuctionHouse.Auth.entity;

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
