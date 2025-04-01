package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.Lingua;
import it.Nkkz.gestione.scuola.entity.Livello;
import lombok.Data;
import java.util.List;

@Data
public class CorsoRequestDTO {
	private Lingua lingua;
	private Livello livello;
	private String tipoCorso;
	private String tipoCorsoGruppo;
	private String frequenza;
	private String giorno;
	private String orario;
	private String secondoGiorno;
	private String secondoOrario;
	private Long insegnanteId;
	private Long aulaId;
	private List<Long> studentiIds;
}
