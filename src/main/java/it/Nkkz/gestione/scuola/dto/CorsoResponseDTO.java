package it.Nkkz.gestione.scuola.dto;

import lombok.Data;
import java.util.List;

@Data
public class CorsoResponseDTO {
	private Long id;
	private String lingua;
	private String tipoCorso;
	private String frequenza;
	private String giorno;
	private String orario;
	private InsegnanteResponseDTO insegnantePreferito;
	private AulaRequestDTO aula;
	private List<String> nomiStudenti;
}

