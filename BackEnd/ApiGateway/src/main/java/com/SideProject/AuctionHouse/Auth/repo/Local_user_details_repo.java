package com.SideProject.AuctionHouse.Auth.repo;

import com.SideProject.AuctionHouse.Auth.entity.Local_user_details;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Local_user_details_repo extends JpaRepository<Local_user_details, String> {

    Local_user_details findByEmail(String email);
}
