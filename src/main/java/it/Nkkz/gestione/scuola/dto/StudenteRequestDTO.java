package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.Giorno;
import it.Nkkz.gestione.scuola.entity.Lingua;
import it.Nkkz.gestione.scuola.entity.Livello;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class StudenteRequestDTO {
	private Long studenteId;
	private String nome;
	private String cognome;
	private int eta;
	private LocalDate dataIscrizione;
	private Lingua linguaDaImparare;
	private Livello livello;
	private Set<Giorno> giorniPreferiti;
	private Set<String> fasceOrariePreferite;
	private boolean corsoPrivato;
	private Integer frequenzaCorsoPrivato;
	private String tipoCorsoGruppo;
	private Long insegnanteId;
	private String tipologiaIscrizione;
}
