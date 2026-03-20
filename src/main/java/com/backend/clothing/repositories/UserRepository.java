package com.backend.clothing.repositories;

import com.backend.clothing.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Spring automatically generates the SQL to find a user by their email!
    // This is vital for the login process.
    Optional<User> findByEmail(String email);

    // Useful for finding the user to generate their Tableau token
    Optional<User> findByTableauUserId(String tableauUserId);
}