package com.expensemanagement.auth;

import com.expensemanagement.auth.dto.AuthRequest;
import com.expensemanagement.auth.dto.AuthResponse;
import com.expensemanagement.auth.dto.RegisterRequest;
import com.expensemanagement.config.JwtConfig;
import com.expensemanagement.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtConfig jwtConfig;

    public AuthService(
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtConfig jwtConfig
    ) {
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtConfig = jwtConfig;
    }

    public AuthResponse register(RegisterRequest request) {
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(request.getRole() != null ? request.getRole() : "EMPLOYEE")
                .build();

        String jwtToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtConfig.getExpiration())
                .email(request.getEmail())
                .role(request.getRole() != null ? request.getRole() : "EMPLOYEE")
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtConfig.getExpiration())
                .email(request.getEmail())
                .build();
    }
}
