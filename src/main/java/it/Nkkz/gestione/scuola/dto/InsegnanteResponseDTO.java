package it.Nkkz.gestione.scuola.dto;

import lombok.Data;
import java.util.Set;

@Data
public class InsegnanteResponseDTO {
	private Long id;
	private String nome;
	private String cognome;
	private Set<String> giorniDisponibili;
	private Set<String> fasceOrarieDisponibili;
	private int oreMensili;
}
