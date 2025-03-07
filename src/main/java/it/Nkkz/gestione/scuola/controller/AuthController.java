package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.auth.RegisterRequest;
import it.Nkkz.gestione.scuola.service.AppUserService;
import it.Nkkz.gestione.scuola.entity.app_users.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AppUserService appUserService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        // Controllo che il ruolo sia valido (ROLE_ADMIN o ROLE_INSEGNANTE)
        if (!registerRequest.getRole().equals(Role.ROLE_ADMIN) && !registerRequest.getRole().equals(Role.ROLE_INSEGNANTE)) {
            return ResponseEntity.badRequest().body("Ruolo non valido. Usa 'ROLE_ADMIN' o 'ROLE_INSEGNANTE'");
        }

        appUserService.registerUser(
            registerRequest.getUsername(),
            registerRequest.getEmail(),
            registerRequest.getPassword(),
            Set.of(registerRequest.getRole()) // Permettiamo di scegliere il ruolo
        );
        return ResponseEntity.ok("Registrazione avvenuta con successo");
    }
}

