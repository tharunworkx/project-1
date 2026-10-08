package com.expensemanagement.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        if (principal != null && principal.getName() != null) {
            return userRepository.findByEmail(principal.getName())
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or hasAnyAuthority('Admin', 'Manager')")
    public ResponseEntity<User> createUser(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String firstName = (String) body.get("firstName");
        String lastName = (String) body.get("lastName");
        if (firstName == null && name != null) {
            firstName = name.split(" ")[0];
            lastName = name.contains(" ") ? name.substring(name.indexOf(' ') + 1) : "Account";
        }
        if (firstName == null) firstName = "User";
        if (lastName == null) lastName = "Account";

        String email = body.get("email") != null ? ((String) body.get("email")).toLowerCase().trim() : "user" + System.currentTimeMillis() + "@company.com";
        String password = (String) body.get("password");
        if (password == null || password.isBlank()) {
            password = "password123";
        }
        String department = body.get("department") != null ? (String) body.get("department") : "General";
        String role = body.get("role") != null ? (String) body.get("role") : "Employee";

        String resolvedName = (name != null && !name.isBlank()) ? name.trim() : (firstName + " " + lastName).trim();
        User user = User.builder()
                .name(resolvedName)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .department(department)
                .role(role)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(userRepository.save(user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Admin')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
