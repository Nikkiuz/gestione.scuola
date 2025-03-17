package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.auth.LoginRequest;
import it.Nkkz.gestione.scuola.auth.LoginResponse;
import it.Nkkz.gestione.scuola.auth.RegisterRequest;
import it.Nkkz.gestione.scuola.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AppUserService appUserService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        appUserService.registerUser(
            registerRequest.getUsername(),
            registerRequest.getEmail(),
            registerRequest.getPassword(),
            registerRequest.getRole()
        );

        return ResponseEntity.ok("Registrazione avvenuta con successo");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(appUserService.authenticate(loginRequest));
    }
}
