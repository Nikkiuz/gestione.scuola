package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.entity.app_users.AppUser;
import it.Nkkz.gestione.scuola.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AppUserRepository appUserRepository;

    @Override
<<<<<<< Updated upstream
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato con username: " + username));

        return appUser;

=======
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        //Cerchiamo l'utente sia per email che per username
        AppUser appUser = appUserRepository.findByEmail(usernameOrEmail)
            .or(() -> appUserRepository.findByUsername(usernameOrEmail))
            .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato: " + usernameOrEmail));

        //Convertiamo l'utente in un oggetto UserDetails
        return User.builder()
            .username(appUser.getEmail())  // 👈 Usiamo l'email come "username"
            .password(appUser.getPassword())  // 🔐 Password già hashata nel database
            .roles(appUser.getRoles().stream()
                .map(role -> role.name().replace("ROLE_", "")) // 🔹 Rimuove "ROLE_" dal nome
                .toArray(String[]::new))
            .build();
>>>>>>> Stashed changes
    }
}
