package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.app_users.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<AppUser> findByEmail(String email);

}