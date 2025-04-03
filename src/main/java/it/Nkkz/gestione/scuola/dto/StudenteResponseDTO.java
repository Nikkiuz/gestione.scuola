package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.Giorno;
import it.Nkkz.gestione.scuola.entity.Lingua;
import it.Nkkz.gestione.scuola.entity.Livello;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
public class StudenteResponseDTO {
	private Long id;
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
	private String insegnanteNome;
	private String insegnanteCognome;
	private String tipologiaIscrizione;
	private List<CorsoAttivo> corsi;

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class CorsoAttivo {
		private Long id;
		private boolean attivo;
	}
}
