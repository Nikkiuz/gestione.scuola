package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.Giorno;
import it.Nkkz.gestione.scuola.entity.Lingua;
import lombok.Data;
import java.util.Set;

@Data
public class InsegnanteResponseDTO {
	private Long id;
	private String nome;
	private String cognome;
	private String email;
	private Lingua lingua;
	private Set<Giorno> giorniDisponibili;
	private Set<String> fasceOrarieDisponibili;
	private int oreMensili;
}
