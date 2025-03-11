package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.entity.app_users.AppUser;
import it.Nkkz.gestione.scuola.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AppUserRepository appUserRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 🔹 Cerchiamo l'utente nel database usando l'email
        AppUser appUser = appUserRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato con email: " + email));

        // 🔹 Convertiamo l'utente in un oggetto UserDetails
        return User.builder()
            .username(appUser.getEmail())  // 👈 Qui usiamo l'email come "username"
            .password(appUser.getPassword())  // 🔐 Password già hashata nel database
            .roles(appUser.getRoles().stream()
                .map(role -> role.name().replace("ROLE_", "")) //
                .toArray(String[]::new))
            .build();
    }
}
