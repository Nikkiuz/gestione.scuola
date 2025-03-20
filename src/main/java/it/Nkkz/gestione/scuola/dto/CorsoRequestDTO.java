package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.Livello;
import lombok.Data;
import java.util.List;

@Data
public class CorsoRequestDTO {
	private String lingua;
	private Livello livello;
	private String tipoCorso;
	private String tipoCorsoGruppo;
	private String frequenza;
	private String giorno;
	private String orario;
	private Long insegnanteId;
	private Long aulaId;
	private List<Long> studentiIds;
}
