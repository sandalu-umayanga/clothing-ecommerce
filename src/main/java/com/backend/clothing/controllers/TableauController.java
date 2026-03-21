package com.backend.clothing.controllers;

import com.backend.clothing.models.User;
import com.backend.clothing.services.TableauAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/tableau")
@CrossOrigin(origins = "*")
public class TableauController {

    private final TableauAuthService tableauAuthService;

    @Autowired
    public TableauController(TableauAuthService tableauAuthService) {
        this.tableauAuthService = tableauAuthService;
    }

    @GetMapping("/token")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> getTableauToken(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        // Typically, the subject of the Tableau JWT should be the user's email or Tableau username
        String token = tableauAuthService.generateTableauToken(user.getEmail());
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }
}