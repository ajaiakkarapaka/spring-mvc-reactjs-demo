package com.example.employmentapp.controller;

import com.example.employmentapp.model.AppUser;
import com.example.employmentapp.service.AppUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class AppUserController {
    private final AppUserService service;

    public AppUserController(AppUserService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
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

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AppUser createUser(@RequestBody AppUser user) {
        return service.save(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AppUser updateUser(@PathVariable Long id, @RequestBody AppUser user) {
        AppUser existing = service.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        existing.setUsername(user.getUsername());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existing.setPassword(user.getPassword());
        }
        existing.setRole(user.getRole());
        return service.save(existing);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        service.deleteById(id);
    }
}
