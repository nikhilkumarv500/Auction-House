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
public class Local_user_details {
    @Id
    public String email;
    public String name;
    public Long balance_amount;
}
