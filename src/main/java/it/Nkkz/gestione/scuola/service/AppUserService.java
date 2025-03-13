package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.auth.LoginRequest;
import it.Nkkz.gestione.scuola.auth.LoginResponse;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
            throw new EntityExistsException("❌ Username già in uso");
        }
        if (appUserRepository.existsByEmail(email)) {
            throw new EntityExistsException("❌ Email già in uso");
        }

        AppUser appUser = new AppUser();
        appUser.setUsername(username);
        appUser.setEmail(email);
        appUser.setPassword(passwordEncoder.encode(password));
        appUser.setRoles(roles);

        appUserRepository.save(appUser);
        logger.info("✅ Nuovo utente registrato: {}", username);

        try {
            String subject = "Benvenuto in Gestione Scuola!";
            String text = "<h1>Benvenuto, " + username + "!</h1><p>Il tuo account è stato creato con successo.</p>";
            emailService.sendEmail(email, subject, text);
            logger.info("📨 Email di conferma inviata a {}", email);
        } catch (Exception e) {
            logger.error("❌ Errore nell'invio dell'email a {}: {}", email, e.getMessage());
        }

        try {
            String adminNotification = "<h1>Nuovo utente registrato!</h1>" +
                "<p>Username: " + username + "</p>" +
                "<p>Email: " + email + "</p>" +
                "<p>Ruolo: " + roles.iterator().next().name() + "</p>";

            emailService.sendEmail(adminEmail, "📢 Nuovo utente registrato!", adminNotification);
            logger.info("📨 Notifica inviata all'Admin: {}", adminEmail);
        } catch (Exception e) {
            logger.error("❌ Errore nell'invio della notifica all'admin {}: {}", adminEmail, e.getMessage());
        }

        return appUser;
    }

    public LoginResponse authenticate(LoginRequest loginRequest) {
        logger.info("➡️ Tentativo di login con email: {}", loginRequest.getEmail());

        AppUser user = appUserRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> {
                logger.warn("❌ Utente non trovato per email: {}", loginRequest.getEmail());
                return new UsernameNotFoundException("Utente non trovato");
            });

        logger.info("🔑 Trovato utente: {}", user.getEmail());

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("❌ Password errata");
        }

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getEmail(), loginRequest.getPassword())
        );

        logger.info("✅ Autenticazione riuscita per: {}", user.getEmail());

        String token = jwtTokenUtil.generateToken(user);
        logger.info("🛡️ Token generato: {}", token);

        String role = user.getRoles().iterator().next().name().replace("ROLE_", "");

        return new LoginResponse(token, role, user.getId());
    }

    public Optional<AppUser> findByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    public Optional<AppUser> findByEmail(String email) {
        return appUserRepository.findByEmail(email);
    }
}
