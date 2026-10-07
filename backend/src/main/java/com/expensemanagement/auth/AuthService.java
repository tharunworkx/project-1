package com.expensemanagement.auth;

import com.expensemanagement.auth.dto.AuthRequest;
import com.expensemanagement.auth.dto.AuthResponse;
import com.expensemanagement.auth.dto.RegisterRequest;
import com.expensemanagement.config.JwtConfig;
import com.expensemanagement.security.JwtService;
import com.expensemanagement.user.User;
import com.expensemanagement.user.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtConfig jwtConfig;
    private final UserRepository userRepository;

    public AuthService(
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtConfig jwtConfig,
            UserRepository userRepository
    ) {
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtConfig = jwtConfig;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void seedInitialUsers() {
        java.util.List<String> exampleEmails = java.util.List.of(
                "alex.morgan@company.com",
                "karthik.m@company.com",
                "anita.d@company.com",
                "arun.kumar@company.com",
                "priya.s@company.com"
        );
        for (String exEmail : exampleEmails) {
            userRepository.findByEmail(exEmail).ifPresent(userRepository::delete);
        }

        seedUser("Tharun", "Workx", "tharun@mail.com", "Tharun@123", "Engineering & DevOps", "Admin");
    }

    private void seedUser(String first, String last, String email, String rawPassword, String dept, String role) {
        String normalizedEmail = email.toLowerCase().trim();
        userRepository.findByEmail(normalizedEmail).ifPresentOrElse(
                user -> {
                    user.setPassword(passwordEncoder.encode(rawPassword));
                    user.setFirstName(first);
                    user.setLastName(last);
                    user.setDepartment(dept);
                    user.setRole(role);
                    userRepository.save(user);
                },
                () -> {
                    User user = User.builder()
                            .firstName(first)
                            .lastName(last)
                            .email(normalizedEmail)
                            .password(passwordEncoder.encode(rawPassword))
                            .department(dept)
                            .role(role)
                            .build();
                    userRepository.save(user);
                }
        );
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User with email " + email + " already exists");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .department(request.getDepartment() != null ? request.getDepartment() : "General")
                .role(request.getRole() != null ? request.getRole() : "Employee")
                .build();
        user = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", "usr_" + user.getId());
        userMap.put("name", user.getFirstName() + " " + user.getLastName());
        userMap.put("email", user.getEmail());
        userMap.put("role", user.getRole());
        userMap.put("department", user.getDepartment());

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .token(jwtToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtConfig.getExpiration())
                .email(user.getEmail())
                .role(user.getRole())
                .user(userMap)
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", "usr_" + user.getId());
        userMap.put("name", user.getFirstName() + " " + user.getLastName());
        userMap.put("email", user.getEmail());
        userMap.put("role", user.getRole());
        userMap.put("department", user.getDepartment());

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .token(jwtToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtConfig.getExpiration())
                .email(user.getEmail())
                .role(user.getRole())
                .user(userMap)
                .build();
    }
}
