package it.Nkkz.gestione.scuola.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.util.Set;

@Data
public class StudenteResponseDTO {
	private Long id;
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
	private InsegnanteResponseDTO insegnante; // ✅ Adesso è un DTO, non una stringa
	@Pattern(regexp = "^(PACCHETTO|SINGOLA|ALTRO)$", message = "Tipologia di pagamento non valida")
	private String tipologiaPagamento;

}
