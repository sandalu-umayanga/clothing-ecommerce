package com.backend.clothing.controllers;

import com.backend.clothing.models.CustomDesign;
import com.backend.clothing.models.User;
import com.backend.clothing.repositories.CustomDesignRepository;
import com.backend.clothing.repositories.UserRepository;
import com.backend.clothing.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/custom-designs")
@CrossOrigin(origins = "*")
public class CustomDesignController {

    private final FileStorageService fileStorageService;
    private final CustomDesignRepository customDesignRepository;
    private final UserRepository userRepository; // Needed to link the design to a user

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
            @RequestParam("userId") Long userId) { // In a real app, you'd get the user from the JWT token

        // 1. Save the image file to the local directory
        String fileUrl = fileStorageService.saveFile(file);

        // 2. Fetch the user (For now, we assume the user exists or we throw an error)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Create the database record
        CustomDesign design = new CustomDesign();
        design.setUser(user);
        design.setDesignFileUrl(fileUrl);
        design.setSpecifications(specifications);
        design.setStatus(CustomDesign.Status.PENDING_REVIEW);

        // 4. Save to PostgreSQL
        CustomDesign savedDesign = customDesignRepository.save(design);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedDesign);
    }
}