package it.Nkkz.gestione.scuola.dto;

import lombok.Data;
import java.util.List;

@Data
public class CorsoRequestDTO {
	private String lingua;
	private String tipoCorso;
	private String frequenza;
	private String giorno;
	private String orario;
	private String secondoGiorno; // 🔹 Nuovo campo per corsi "2 volte a settimana"
	private String secondoOrario; // 🔹 Nuovo campo per corsi "2 volte a settimana"
	private Long insegnanteId;
	private Long aulaId;
	private List<Long> studentiIds;
}
