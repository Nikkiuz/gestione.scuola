package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.Lingua;
import it.Nkkz.gestione.scuola.entity.Livello;
import lombok.Data;
import java.util.Set;

@Data
public class StudenteRequestDTO {
	private Long studenteId;
	private String nome;
	private String cognome;
	private int eta;
	private Lingua linguaDaImparare;
	private Livello livello;
	private Set<String> giorniPreferiti;
	private Set<String> fasceOrariePreferite;
	private boolean corsoPrivato;
	private Integer frequenzaCorsoPrivato;
	private String tipoCorsoGruppo;
	private Long insegnanteId;
	private String tipologiaIscrizione;
}
