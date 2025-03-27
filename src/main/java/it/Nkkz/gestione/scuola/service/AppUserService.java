package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.entity.app_users.AppUser;
import it.Nkkz.gestione.scuola.repository.AppUserRepository;
import it.Nkkz.gestione.scuola.entity.app_users.Role;
import it.Nkkz.gestione.scuola.auth.JwtTokenUtil;
import jakarta.persistence.EntityExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class AppUserService {

    private static final Logger logger = LoggerFactory.getLogger(AppUserService.class);

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private EmailService emailService;

    @Value("${spring.mail.username}")
    private String adminEmail;

    public AppUser registerUser(String username, String email, String password, Set<Role> roles) {
        if (appUserRepository.existsByUsername(username)) {
            throw new EntityExistsException("Username già in uso");
        }
        if (appUserRepository.existsByEmail(email)) {
            throw new EntityExistsException("Email già in uso");
        }

        AppUser appUser = new AppUser();
        appUser.setUsername(username);
        appUser.setEmail(email);
        appUser.setPassword(passwordEncoder.encode(password));
        appUser.setRoles(roles);

        // Salva utente
        appUserRepository.save(appUser);
        logger.info("Nuovo utente registrato: {}", username);

        // Invia email di conferma all'utente
        try {
            String subject = "Benvenuto in Gestione Scuola!";
            String text = "<h1>Benvenuto, " + username + "!</h1><p>Il tuo account è stato creato con successo.</p>";
            emailService.sendEmail(email, subject, text);
            logger.info("Email di conferma inviata a {}", email);
        } catch (Exception e) {
            logger.error("Errore nell'invio dell'email a {}: {}", email, e.getMessage());
        }

        // Invia notifica all'Admin
        try {
            String adminNotification = "<h1>Nuovo utente registrato!</h1><p>Username: " + username + "</p><p>Email: " + email + "</p>";
            emailService.sendEmail(adminEmail, "Nuovo utente registrato", adminNotification);
            logger.info("Notifica admin inviata a {}", adminEmail);
        } catch (Exception e) {
            logger.error("Errore nell'invio della notifica all'admin {}: {}", adminEmail, e.getMessage());
        }

        return appUser;
    }

<<<<<<< Updated upstream
=======
    public LoginResponse authenticate(LoginRequest loginRequest) {
        System.out.println("➡️ Tentativo di login con email: " + loginRequest.getEmail());

        // Trova l'utente nel database usando l'email
        AppUser user = appUserRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> {
                System.out.println("❌ Utente non trovato per email: " + loginRequest.getEmail());
                return new UsernameNotFoundException("Utente non trovato");
            });

        System.out.println("🔑 Trovato utente: " + user.getEmail());

        // Autenticazione usando l'email e la password
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getEmail(), loginRequest.getPassword())
        );

        System.out.println("✅ Autenticazione riuscita per: " + user.getEmail());

        String token = jwtTokenUtil.generateToken(user);
        System.out.println("🛡️ Token generato: " + token);

        return new LoginResponse(token, user.getId());
    }

>>>>>>> Stashed changes
    public Optional<AppUser> findByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }
}
