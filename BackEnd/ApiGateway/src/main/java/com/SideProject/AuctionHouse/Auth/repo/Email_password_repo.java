package com.SideProject.AuctionHouse.Auth.repo;

import com.SideProject.AuctionHouse.Auth.entity.Email_password;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Email_password_repo extends JpaRepository<Email_password, String> {

    Email_password findByEmail(String email);
}
