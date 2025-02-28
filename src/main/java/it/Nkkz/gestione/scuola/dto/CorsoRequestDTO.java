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
	private Long insegnanteId;
	private Long aulaId;
	private List<Long> studentiIds;
}
