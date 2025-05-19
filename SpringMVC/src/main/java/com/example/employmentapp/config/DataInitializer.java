package com.example.employmentapp.config;

import com.example.employmentapp.model.AppUser;
import com.example.employmentapp.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initUsers(AppUserRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                AppUser admin = new AppUser();
                admin.setUsername("admin");
                admin.setPassword("admin123"); // plain text password
                admin.setRole("ADMIN");
                userRepository.save(admin);
            }
            if (userRepository.findByUsername("user").isEmpty()) {
                AppUser user = new AppUser();
                user.setUsername("user");
                user.setPassword("user123"); // plain text password
                user.setRole("USER");
                userRepository.save(user);
            }
        };
    }
}
