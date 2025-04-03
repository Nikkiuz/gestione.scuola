package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.Giorno;
import it.Nkkz.gestione.scuola.entity.Lingua;
import it.Nkkz.gestione.scuola.entity.Livello;
import lombok.Data;
import java.util.List;

@Data
public class CorsoResponseDTO {
	private Long id;
	private Lingua lingua;
	private Livello livello;
	private String tipoCorsoGruppo;
	private String tipoCorso;
	private String frequenza;
	private Giorno giorno;
	private String orario;
	private Giorno secondoGiorno;
	private String secondoOrario;
	private InsegnanteResponseDTO insegnante;
	private AulaResponseDTO aula;
	private List<StudenteResponseDTO> studenti;
	private boolean attivo;
}

