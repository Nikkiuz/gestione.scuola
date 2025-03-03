package it.Nkkz.gestione.scuola.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "studenti")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Studente {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String nome;

	@Column(nullable = false)
	private String cognome;

	@Column(nullable = false)
	private int eta;

	@Column(nullable = false)
	private String linguaDaImparare;

	@Column(nullable = false)
	private String livello;  // Inserito manualmente dall'admin

	@ElementCollection
	private Set<String> giorniPreferiti;  // Es. ["Lunedì", "Mercoledì"]

	@ElementCollection
	private Set<String> fasceOrariePreferite;  // Es. ["16:00-18:00", "18:00-20:00"]

	@Column(nullable = false)
	private boolean corsoPrivato;  // True = privato, False = gruppo

	private Integer frequenzaCorsoPrivato; // Valido solo se corsoPrivato == true (minimo 1 ora)

	private String tipoCorsoGruppo; // "1 volta a settimana" oppure "2 volte a settimana"

	@ManyToOne
	@JoinColumn(name = "insegnante_id")
	private Insegnante insegnante;  // 🔥 ORA È GIUSTO! `Insegnante` è un'entità separata

	@Column(nullable = false)
	private String tipologiaPagamento;  // Ex "Tipo di iscrizione"

	// ✅ Metodo per ottenere i giorni disponibili
	public Set<String> getGiorniDisponibili() {
		return giorniPreferiti;
	}

}
