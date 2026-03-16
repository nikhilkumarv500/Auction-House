package com.AuctionHouse.MainService.config.jwtConfig.repo;

import com.AuctionHouse.MainService.config.jwtConfig.entity.Email_password;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Email_password_repo extends JpaRepository<Email_password, String> {

    Email_password findByEmail(String email);
}
