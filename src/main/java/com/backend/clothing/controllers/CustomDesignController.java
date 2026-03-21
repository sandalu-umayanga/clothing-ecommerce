package com.backend.clothing.controllers;

import com.backend.clothing.models.CustomDesign;
import com.backend.clothing.models.User;
import com.backend.clothing.repositories.CustomDesignRepository;
import com.backend.clothing.repositories.UserRepository;
import com.backend.clothing.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/custom-designs")
@CrossOrigin(origins = "*")
public class CustomDesignController {

    private final FileStorageService fileStorageService;
    private final CustomDesignRepository customDesignRepository;
    private final UserRepository userRepository;

    @Autowired
    public CustomDesignController(FileStorageService fileStorageService,
                                  CustomDesignRepository customDesignRepository,
                                  UserRepository userRepository) {
        this.fileStorageService = fileStorageService;
        this.customDesignRepository = customDesignRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<CustomDesign> uploadCustomDesign(
            @RequestParam("file") MultipartFile file,
            @RequestParam("specifications") String specifications,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();
        String fileUrl = fileStorageService.saveFile(file);

        CustomDesign design = new CustomDesign();
        design.setUser(currentUser);
        design.setDesignFileUrl(fileUrl);
        design.setSpecifications(specifications);
        design.setStatus(CustomDesign.Status.PENDING_REVIEW);

        CustomDesign savedDesign = customDesignRepository.save(design);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDesign);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomDesign(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("specifications") String specifications,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();

        return customDesignRepository.findById(id).map(design -> {
            if (!design.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied.");
            }

            if (design.getStatus() != CustomDesign.Status.PENDING_REVIEW) {
                return ResponseEntity.badRequest().body("Error: Only PENDING_REVIEW designs can be edited.");
            }

            if (file != null && !file.isEmpty()) {
                String fileUrl = fileStorageService.saveFile(file);
                design.setDesignFileUrl(fileUrl);
            }
            design.setSpecifications(specifications);
            
            return ResponseEntity.ok(customDesignRepository.save(design));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserDesigns(@PathVariable Long userId, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(customDesignRepository.findByUserId(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllDesigns(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        if (currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(customDesignRepository.findAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDesignStatus(
            @PathVariable Long id,
            @RequestParam CustomDesign.Status status,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();
        if (currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return customDesignRepository.findById(id).map(design -> {
            design.setStatus(status);
            return ResponseEntity.ok(customDesignRepository.save(design));
        }).orElse(ResponseEntity.notFound().build());
    }
}