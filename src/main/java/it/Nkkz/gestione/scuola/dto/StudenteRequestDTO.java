package it.Nkkz.gestione.scuola.dto;

import lombok.Data;
import java.util.Set;

@Data
public class StudenteRequestDTO {
	private String nome;
	private String cognome;
	private int eta;
	private String linguaDaImparare;
	private String livello;
	private Set<String> giorniPreferiti;
	private Set<String> fasceOrariePreferite;
	private boolean corsoPrivato;
	private Integer frequenzaCorsoPrivato;
	private String tipoCorsoGruppo;
	private Long insegnanteId;
	private String tipologiaIscrizione;
}
