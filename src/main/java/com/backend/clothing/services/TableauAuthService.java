package com.backend.clothing.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

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
        Map<String, Object> claims = new HashMap<>();
        // For authoring and saving, you need specific scopes.
        claims.put("scp", new String[]{"tableau:views:embed", "tableau:views:embed_authoring"});

        Instant now = Instant.now();

        return Jwts.builder()
                .setHeaderParam("kid", secretId)
                .setHeaderParam("iss", clientId)
                .setSubject(username)
                .setAudience("tableau")
                .setExpiration(Date.from(now.plus(5, ChronoUnit.MINUTES))) // Tokens should be short-lived
                .setIssuedAt(Date.from(now))
                .setId(UUID.randomUUID().toString()) // jti claim
                .addClaims(claims)
                .signWith(SignatureAlgorithm.HS256, secretValue.getBytes())
                .compact();
    }
}