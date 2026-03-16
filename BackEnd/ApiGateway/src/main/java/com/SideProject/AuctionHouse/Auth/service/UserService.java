package com.SideProject.AuctionHouse.Auth.service;

import com.SideProject.AuctionHouse.Auth.Dto.RequestDto.*;
import com.SideProject.AuctionHouse.Auth.Dto.ResponseDto.*;
import com.SideProject.AuctionHouse.Auth.config.helpers.JWTService;
import com.SideProject.AuctionHouse.Auth.entity.Email_password;
import com.SideProject.AuctionHouse.Auth.entity.Local_user_details;
import com.SideProject.AuctionHouse.Auth.repo.Email_password_repo;
import com.SideProject.AuctionHouse.Auth.repo.Local_user_details_repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private Email_password_repo emailPasswordRepo;

    @Autowired
    private Local_user_details_repo localUserDetailsRepo;


    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public ResponseEntity<Object> register(RegisterRequestDto user) {

        // Request Error checks : start ----------------------------------------------------

        if(user.getEmail()==null || user.getPassword()==null || user.getName()==null ||
                user.getEmail().length()==0 || user.getPassword().length()==0 || user.getName().length()==0) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Few details are missing", HttpStatus.BAD_REQUEST.value()));
        }

        if(user.getPassword().length()<4) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Password length should be greater then 4", HttpStatus.BAD_REQUEST.value()));
        }

        if(isValidEmail(user.getEmail())==false) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Invalid email format", HttpStatus.BAD_REQUEST.value()));
        }

        Email_password emailPasswordUniqueCheckObj=null;

        try {
            emailPasswordUniqueCheckObj = emailPasswordRepo.findByEmail(user.getEmail());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(GeneralErrorDto.builder()
                            .error(true)
                            .message("Error in Email_password DB-table | in register")
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        }


        if(emailPasswordUniqueCheckObj!=null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Email already exists", HttpStatus.BAD_REQUEST.value()));
        }

        //Request Error checks : end-----------------------------------------------

        user.setRole("USER");
        user.setPassword(encoder.encode(user.getPassword()));

        try {
            //to add in email_password table
            Email_password emailPasswordObj = new Email_password(user.getEmail(), user.getPassword(), "USER");
            emailPasswordRepo.save(emailPasswordObj);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(GeneralErrorDto.builder()
                            .error(true)
                            .message("Error in Email_password DB-table | in register")
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        }

        try {
            // to add in Local_user_details table
            Local_user_details localUserDetailsObj = new Local_user_details(user.getEmail(), user.getName(), 0L);
            localUserDetailsRepo.save(localUserDetailsObj);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(GeneralErrorDto.builder()
                            .error(true)
                            .message("Error in Local_user_details DB-table | in register")
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        }



        return ResponseEntity.status(HttpStatus.OK)
                .body(new RegisterSuccessDto(false, "Registration successfull", HttpStatus.OK.value()));
    }

    public ResponseEntity<Object> login(LoginRequestDto user) {

        if(user.getEmail()==null || user.getPassword()==null ||
                user.getEmail().length()==0 || user.getPassword().length()==0 ) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Few details are missing", HttpStatus.BAD_REQUEST.value()));
        }

        Email_password emailPasswordExistsCheckObj = null;

        try {
            emailPasswordExistsCheckObj = emailPasswordRepo.findByEmail(user.getEmail());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(GeneralErrorDto.builder()
                            .error(true)
                            .message("Error in Email_password DB-table | in login")
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        }

        if(emailPasswordExistsCheckObj==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Email does not exists", HttpStatus.BAD_REQUEST.value()));
        }

        Authentication authentication;

        try {
            authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        } catch (BadCredentialsException e) {

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Invalid email or password", HttpStatus.BAD_REQUEST.value()));
        }

        if (authentication.isAuthenticated()) {
            String jwtToken =  jwtService.generateToken(user.getEmail());

            Local_user_details currentLoggedinUser = null;

            try {
                currentLoggedinUser = localUserDetailsRepo.findByEmail(user.getEmail());
            }
            catch (Exception e) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(GeneralErrorDto.builder()
                                .error(true)
                                .message("Error in Local_user_details DB-table | in login")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build());
            }

            return ResponseEntity.status(HttpStatus.OK)
                    .body(LoginSuccessDto.builder()
                            .error(false)
                            .message("Login successfull")
                            .statusCode(HttpStatus.OK.value())
                            .jwtToken(jwtToken)
                            .name(currentLoggedinUser.getName())
                            .email(currentLoggedinUser.getEmail())
                            .balance_amount(currentLoggedinUser.getBalance_amount())
                            .build());


        } else {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Wrong email or password", HttpStatus.BAD_REQUEST.value()));
        }
    }

    public static boolean isValidEmail(String email) {
        return email != null &&
                email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    public ResponseEntity<Object> checkJwt() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(new GeneralErrorDto(false, "Valid Jwt token", HttpStatus.OK.value()));
    }

    public ResponseEntity<Object> getBankBalance(GetBankBalanceRequestDto requestDto) {

        if(requestDto.getEmail()==null || requestDto.getEmail().length()==0) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Few details are missing", HttpStatus.BAD_REQUEST.value()));
        }

        Local_user_details currentLoggedinUser = null;

        try {
            currentLoggedinUser = localUserDetailsRepo.findByEmail(requestDto.getEmail());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(GeneralErrorDto.builder()
                            .error(true)
                            .message("Error in Local_user_details DB-table | in getBankBalance")
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        }


        if(currentLoggedinUser==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Email does not exists", HttpStatus.BAD_REQUEST.value()));
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(GetBankBalanceResponseDto.builder()
                        .balance_amount(currentLoggedinUser.getBalance_amount())
                        .build());
    }

    public ResponseEntity<Object> resetPasswordAsAdmin(ResetPasswordRequestDto resetPasswordRequestDto) {

        if(resetPasswordRequestDto.getUser_password()==null || resetPasswordRequestDto.getUser_email()==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Few details are missing", HttpStatus.BAD_REQUEST.value()));
        }

        Email_password user = null;

        try {
            user  = emailPasswordRepo.findByEmail(resetPasswordRequestDto.getUser_email());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(GeneralErrorDto.builder()
                            .error(true)
                            .message("Error in Email_password DB-table | in resetPasswordAsAdmin")
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        }

        if(user==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(GeneralErrorDto.builder()
                            .error(true)
                            .message("User does not exists")
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        }


        user.setPassword(encoder.encode(resetPasswordRequestDto.getUser_password()));

        try {
            emailPasswordRepo.save(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(GeneralErrorDto.builder()
                            .error(true)
                            .message("Error in Email_password DB-table | in resetPasswordAsAdmin")
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(GeneralErrorDto.builder()
                        .error(false)
                        .message("Successfully reset password")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    public ResponseEntity<Object> addMoneyToWallet(AddMoneyToWalletRequestDto requestDto) {

        if(requestDto.getUser_email()==null || requestDto.getAmount()==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Few details are missing", HttpStatus.BAD_REQUEST.value()));
        }

        if(requestDto.getAmount()>5000L) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "You are not allowed add more then 5000 Rs at once", HttpStatus.BAD_REQUEST.value()));
        }

        Local_user_details localUserDetailsObj = null;

        try {
            localUserDetailsObj = localUserDetailsRepo.findByEmail(requestDto.getUser_email());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Error in Local_user_details DB-table | in addMoneyToWallet", HttpStatus.BAD_REQUEST.value()));
        }

        if(localUserDetailsObj==null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "No user found", HttpStatus.BAD_REQUEST.value()));
        }

        if(localUserDetailsObj.getBalance_amount()>50000L) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "You cannot add more then 50k in wallet at once", HttpStatus.BAD_REQUEST.value()));
        }

        localUserDetailsObj.setBalance_amount(localUserDetailsObj.getBalance_amount() + requestDto.getAmount());

        try {
            localUserDetailsRepo.save(localUserDetailsObj);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new GeneralErrorDto(true, "Error in Local_user_details DB-table | in addMoneyToWallet", HttpStatus.BAD_REQUEST.value()));
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(new AddMoneyToWalletResponseDto(false, "Wallet balance updated", HttpStatus.OK.value(), localUserDetailsObj.getBalance_amount()));
    }
}
