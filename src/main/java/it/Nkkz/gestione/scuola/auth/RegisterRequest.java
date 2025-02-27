package it.Nkkz.gestione.scuola.auth;

import it.Nkkz.gestione.scuola.entity.app_users.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;  // Aggiunto
    private String password;
    private Role role;  // Aggiunto
}
