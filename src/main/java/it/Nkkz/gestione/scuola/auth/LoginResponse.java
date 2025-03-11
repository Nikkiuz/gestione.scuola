package it.Nkkz.gestione.scuola.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
	private String token;
	private String role;
	private Long userId; // ✅ Aggiunto userId
}

