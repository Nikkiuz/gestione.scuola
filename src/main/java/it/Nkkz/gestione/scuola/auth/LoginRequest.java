package it.Nkkz.gestione.scuola.auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
