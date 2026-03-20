package com.backend.clothing.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF protection because we are using a stateless REST API, not web forms
                .csrf(AbstractHttpConfigurer::disable)

                // Configure route permissions
                .authorizeHttpRequests(auth -> auth
                        // Allow anyone to access the product catalog APIs without logging in
                        .requestMatchers("/api/products/**").permitAll()

                        // Require authentication for anything else
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}