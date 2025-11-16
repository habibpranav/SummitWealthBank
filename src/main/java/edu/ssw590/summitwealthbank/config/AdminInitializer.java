package edu.ssw590.summitwealthbank.config;

import edu.ssw590.summitwealthbank.model.User;
import edu.ssw590.summitwealthbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername(adminUsername).isEmpty()) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole("ADMIN");

                userRepository.save(admin);
                System.out.println(" Admin user created: " + adminUsername);
            } else {
                System.out.println("️ Admin user already exists: " + adminUsername);
            }
        };
    }
}