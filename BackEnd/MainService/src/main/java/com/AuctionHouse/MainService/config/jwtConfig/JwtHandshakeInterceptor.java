package com.AuctionHouse.MainService.config.jwtConfig;

import com.AuctionHouse.MainService.config.jwtConfig.entity.Email_password;
import com.AuctionHouse.MainService.config.jwtConfig.repo.Email_password_repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    @Autowired
    JWTService jwtService;

    @Autowired
    private Email_password_repo emailPasswordRepo;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        try {

            String token = UriComponentsBuilder
                    .fromUri(request.getURI())
                    .build()
                    .getQueryParams()
                    .getFirst("token");

            if (token == null) {
                writeUnauthorized(response, "Invalid or missing JWT token");
                return false;
            }

            String email = jwtService.extractUserName(token);

            Email_password user = emailPasswordRepo.findByEmail(email);

            if (user == null || !jwtService.validateToken(token, user)) {
                writeUnauthorized(response, "Invalid or missing JWT token");
                return false;
            }

            // Optional: store user for websocket session
            attributes.put("email", email);

            return true;

        } catch (Exception e) {
            writeUnauthorized(response, "Invalid or missing JWT token");
            return false;
        }
    }

    private void writeUnauthorized(ServerHttpResponse response, String message) {
        try {
            response.setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
            response.getHeaders().add("Content-Type", "application/json");

            String body = """
                {
                  "statusCode": 401,
                  "error": true,
                  "message": "%s"
                }
                """.formatted(message);

            response.getBody().write(body.getBytes());
        } catch (Exception ignored) {}
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception ex) {
    }
}

