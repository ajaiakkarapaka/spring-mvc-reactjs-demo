package com.example.employmentapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EmploymentAppApplication {

	public static void main(String[] args) {

		//System.out.println(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("yourpassword"));
		SpringApplication.run(EmploymentAppApplication.class, args);
	}

}
