package com.example.employmentapp.config;

import com.example.employmentapp.model.Users;
import com.example.employmentapp.repository.UsersRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initUsers(UsersRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                Users admin = new Users();
                admin.setUsername("admin");
                admin.setPassword("admin123"); // plain text password       
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
            }
            if (userRepository.findByUsername("user").isEmpty()) {
                Users user = new Users();
                user.setUsername("user");
                user.setPassword("user123"); // plain text password
                user.setRole("ROLE_USER");
                userRepository.save(user);
            }
        };
    }
}
