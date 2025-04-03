package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.Lingua;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CalendarioDTO {
	private Long corsoId;
	private Lingua lingua;
	private String tipoCorso;
	private String frequenza;
	private String giorno;
	private String orario;
	private String aula;
	private String insegnante;
	private String livello;
}
