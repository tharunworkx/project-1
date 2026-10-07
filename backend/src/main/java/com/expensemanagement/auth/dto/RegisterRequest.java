package com.expensemanagement.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String firstName;
    private String lastName;
    private String name; // from frontend form

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 1, message = "Password must not be empty")
    private String password;

    private String department;
    private String role;

    public String getFirstName() {
        if (firstName != null && !firstName.isBlank()) {
            return firstName.trim();
        }
        if (name != null && !name.isBlank()) {
            return name.trim().split("\\s+")[0];
        }
        if (email != null && email.contains("@")) {
            return email.split("@")[0];
        }
        return "User";
    }

    public String getLastName() {
        if (lastName != null && !lastName.isBlank()) {
            return lastName.trim();
        }
        if (name != null && name.trim().contains(" ")) {
            return name.trim().substring(name.trim().indexOf(' ') + 1);
        }
        return "Account";
    }
}
