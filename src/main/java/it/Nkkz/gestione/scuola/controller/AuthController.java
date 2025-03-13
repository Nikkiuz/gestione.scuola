package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.auth.JwtTokenUtil;
import it.Nkkz.gestione.scuola.auth.LoginRequest;
import it.Nkkz.gestione.scuola.auth.LoginResponse;
import it.Nkkz.gestione.scuola.entity.app_users.AppUser;
import it.Nkkz.gestione.scuola.entity.app_users.Role;
import it.Nkkz.gestione.scuola.service.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private AppUserService appUserService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Cerca l'utente tramite email
            AppUser user = appUserService.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

            // Usa il nome utente dell'utente trovato per l'autenticazione
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenUtil.generateToken(userDetails);

            // Seleziona il ruolo (prendendo il primo tra quelli assegnati)
            String role = String.valueOf(user.getRoles().stream().findFirst().orElse(Role.ROLE_INSEGNANTE));
            // Rimuove il prefisso "ROLE_" se presente
            if (role.startsWith("ROLE_")) {
                role = role.substring(5);
            }

            LoginResponse loginResponse = new LoginResponse(token, role, user.getId());
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            // Puoi loggare l'eccezione e/o restituire maggiori dettagli per il debug
            return ResponseEntity.badRequest().body("Email o password errati");
        }
    }
}