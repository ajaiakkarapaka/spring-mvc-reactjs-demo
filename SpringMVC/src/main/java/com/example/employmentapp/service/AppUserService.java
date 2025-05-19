package com.example.employmentapp.service;

import com.example.employmentapp.model.AppUser;
import com.example.employmentapp.repository.AppUserRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class AppUserService implements UserDetailsService {
    private final AppUserRepository repository;

    public AppUserService(AppUserRepository repository) {
        this.repository = repository;
    }

    public Optional<AppUser> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    public List<AppUser> findAll() {
        return repository.findAll();
    }

    public Optional<AppUser> findById(Long id) {
        return repository.findById(id);
    }

    public AppUser save(AppUser user) {
        // Password is handled by the calling code
        return repository.save(user);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}