package com.expensemanagement.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    private String department;

    @Column(nullable = false)
    private String role;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void ensureName() {
        if (this.name == null || this.name.isBlank()) {
            String f = this.firstName != null ? this.firstName : "";
            String l = this.lastName != null ? this.lastName : "";
            this.name = (f + " " + l).trim();
            if (this.name.isEmpty()) {
                this.name = "User";
            }
        }
        if (this.firstName == null || this.firstName.isBlank()) {
            this.firstName = this.name != null && !this.name.isBlank() ? this.name.split("\\s+")[0] : "User";
        }
        if (this.lastName == null || this.lastName.isBlank()) {
            this.lastName = this.name != null && this.name.contains(" ") ? this.name.substring(this.name.indexOf(' ') + 1) : "Account";
        }
    }
}

