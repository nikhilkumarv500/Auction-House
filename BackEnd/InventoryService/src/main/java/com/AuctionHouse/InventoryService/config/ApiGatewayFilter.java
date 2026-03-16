package com.AuctionHouse.InventoryService.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ApiGatewayFilter extends OncePerRequestFilter {

    @Value("${api.gateway.key}")
    private String apiKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        if (path.startsWith("/ws") || path.startsWith("/checkInventoryServiceAlive")) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = request.getHeader("X-API-GATEWAY-KEY");

        if (!apiKey.equals(key)) {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

            response.getWriter().write("""
                {
                  "statusCode": 403,
                  "error": true,
                  "message": "You don't have permission to access this resource"
                }
            """);

            return;
        }

        filterChain.doFilter(request, response);
    }
}

