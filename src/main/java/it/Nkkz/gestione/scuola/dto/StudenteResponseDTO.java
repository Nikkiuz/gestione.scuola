package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.Livello;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
public class StudenteResponseDTO {
	private Long id;
	private String nome;
	private String cognome;
	private int eta;
	private String linguaDaImparare;
	private Livello livello;
	private Set<String> giorniPreferiti;
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
