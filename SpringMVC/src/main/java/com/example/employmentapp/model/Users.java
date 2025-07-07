package com.example.employmentapp.model;

import jakarta.persistence.*;

@Entity
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Version
    private Integer version;
    
    @Column(unique = true)
    private String username;
    
    private String password;
    
    private String role; // ADMIN or USER
    
    @Enumerated(EnumType.STRING)
    private UserType userType; // TEACHER, STUDENT, ADMINISTRATIVE
    
    @Lob
    @Column(length = 1000000)
    private byte[] profilePhoto;
    
    private String profilePhotoContentType;

    public enum UserType {
        TEACHER,
        STUDENT,
        ADMINISTRATIVE
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public UserType getUserType() {
        return userType;
    }
    
    public void setUserType(UserType userType) {
        this.userType = userType;
    }
    
    public byte[] getProfilePhoto() {
        return profilePhoto;
    }
    
    public void setProfilePhoto(byte[] profilePhoto) {
        this.profilePhoto = profilePhoto;
    }
    
    public String getProfilePhotoContentType() {
        return profilePhotoContentType;
    }
    
    public void setProfilePhotoContentType(String profilePhotoContentType) {
        this.profilePhotoContentType = profilePhotoContentType;
    }
}
