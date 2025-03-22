package it.Nkkz.gestione.scuola.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CalendarioDTO {
	private Long corsoId;
	private String lingua;
	private String tipoCorso;
	private String frequenza;
	private String giorno;
	private String orario;
	private String aula;
	private String insegnante;
	private String livello;
}
