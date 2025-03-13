package it.Nkkz.gestione.scuola.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@AllArgsConstructor
public class LoginResponse {
	private String token;
	private String role;
	private Long userId; // ✅ Aggiunto userId
}

