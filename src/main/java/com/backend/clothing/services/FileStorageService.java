package com.backend.clothing.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    // The directory where images will be saved
    private final Path rootLocation = Paths.get("uploads/designs");

    public FileStorageService() {
        try {
            // Create the directory if it doesn't exist when the app starts
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    public String saveFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }

            // Generate a unique file name to prevent overwriting (e.g., 123e4567.jpg)
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".png";
            String newFilename = UUID.randomUUID() + fileExtension;

            // Save the file to the target directory
            Path destinationFile = this.rootLocation.resolve(Paths.get(newFilename)).normalize().toAbsolutePath();
            file.transferTo(destinationFile);

            // Return a relative URL that the frontend can use to load the image
            return "/api/files/designs/" + newFilename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }
}