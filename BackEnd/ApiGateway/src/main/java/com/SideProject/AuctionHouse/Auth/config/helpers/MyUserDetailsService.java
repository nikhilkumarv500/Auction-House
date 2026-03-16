package com.SideProject.AuctionHouse.Auth.config.helpers;

import com.SideProject.AuctionHouse.Auth.entity.Email_password;
import com.SideProject.AuctionHouse.Auth.repo.Email_password_repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private Email_password_repo emailPasswordRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Email_password user = emailPasswordRepo.findByEmail(email);
        if (user == null) {
            System.out.println("User Not Found");
            throw new UsernameNotFoundException("user not found");
        }
        
        return new UserPrincipalModel(user);
    }
}
