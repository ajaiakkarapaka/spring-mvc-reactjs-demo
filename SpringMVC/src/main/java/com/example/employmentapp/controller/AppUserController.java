package com.example.employmentapp.controller;

import com.example.employmentapp.model.AppUser;
import com.example.employmentapp.service.AppUserService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class AppUserController {
    private final AppUserService service;

    public AppUserController(AppUserService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<AppUser> getAllUsers() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AppUser getUserById(@PathVariable Long id) {
        return service.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public AppUser getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) throw new RuntimeException("Not authenticated");
        return service.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestPart("user") AppUser user,
                                     @RequestPart(value = "photo", required = false) MultipartFile photo) throws IOException {
        if (service.findByUsername(user.getUsername()).isPresent()) {
            System.out.println("Duplicate username detected: " + user.getUsername()); // Log duplicate username
            return ResponseEntity.badRequest().body("Error: Username already exists. Please choose a unique username.");
        }

        if (photo != null && !photo.isEmpty()) {
            user.setProfilePhoto(photo.getBytes());
            user.setProfilePhotoContentType(photo.getContentType());
        }

        return ResponseEntity.ok(service.save(user));
    }    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                            @RequestPart("user") AppUser user,
                                            @RequestPart(value = "photo", required = false) MultipartFile photo) throws IOException {
        AppUser existing = service.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));        // Check if username is changed and new username already exists
        if (!existing.getUsername().equals(user.getUsername()) &&
            service.findByUsername(user.getUsername()).isPresent()) {
            System.out.println("Duplicate username detected during update: " + user.getUsername());
            return ResponseEntity.badRequest().body("Error: Username already exists. Please choose a unique username.");
        }

        existing.setUsername(user.getUsername());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existing.setPassword(user.getPassword());
        }
        existing.setRole(user.getRole());
        existing.setUserType(user.getUserType());

        if (photo != null && !photo.isEmpty()) {
            existing.setProfilePhoto(photo.getBytes());
            existing.setProfilePhotoContentType(photo.getContentType());
        }

        return ResponseEntity.ok(service.save(existing));
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> getUserPhoto(@PathVariable Long id) {
        AppUser user = service.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getProfilePhoto() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(user.getProfilePhotoContentType()))
                .body(user.getProfilePhoto());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        service.deleteById(id);
    }
}
