package com.expensemanagement.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    // Ready to be injected with UserRepository when user entity is connected
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Default stub implementation for loading user details
        return new User(username, "", Collections.emptyList());
    }
}
