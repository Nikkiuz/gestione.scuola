package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.Lingua;
import lombok.Data;
import java.util.Set;

@Data
public class InsegnanteRequestDTO {
	private String nome;
	private String cognome;
	private String email;
	private Lingua lingua;
	private Set<String> giorniDisponibili;
	private Set<String> fasceOrarieDisponibili;
}
