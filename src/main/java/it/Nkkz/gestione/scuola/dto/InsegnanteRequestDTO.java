package it.Nkkz.gestione.scuola.dto;

import lombok.Data;
import java.util.Set;

@Data
public class InsegnanteRequestDTO {
	private String nome;
	private String cognome;
	private String email;
	private String lingua;
	private Set<String> giorniDisponibili;
	private Set<String> fasceOrarieDisponibili;
}
