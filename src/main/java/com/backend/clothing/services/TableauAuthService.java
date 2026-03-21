package com.backend.clothing.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class TableauAuthService {

    @Value("${tableau.client-id}")
    private String clientId;

    @Value("${tableau.secret-id}")
    private String secretId;

    @Value("${tableau.secret-value}")
    private String secretValue;

    /**
     * Generates a JWT for a specific user to access embedded Tableau views.
     * @param username The Tableau username (often the user's email).
     * @return A signed JWT string.
     */
    public String generateTableauToken(String username) {
        System.out.println("Generating Tableau Token for user: " + username);
        
        // Scopes must be an array of strings in the "scp" claim
        List<String> scopes = Arrays.asList("tableau:views:embed", "tableau:views:embed_authoring");
        
        Instant now = Instant.now();
        Key signingKey = Keys.hmacShaKeyFor(secretValue.getBytes(StandardCharsets.UTF_8));

        // Tableau JWT Requirements:
        // Header: kid (Secret ID), iss (Client ID) - Note: iss often needed in both
        // Payload: iss (Client ID), sub (Username), aud (tableau), scp (Scopes)
        
        return Jwts.builder()
                .setHeaderParam("kid", secretId)
                .setHeaderParam("iss", clientId)
                .setIssuer(clientId)
                .setSubject(username)
                .setAudience("tableau")
                .setExpiration(Date.from(now.plus(5, ChronoUnit.MINUTES)))
                .setIssuedAt(Date.from(now))
                .setId(UUID.randomUUID().toString())
                .claim("scp", scopes)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }
}