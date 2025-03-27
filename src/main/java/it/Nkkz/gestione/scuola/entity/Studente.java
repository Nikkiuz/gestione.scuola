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
	private Set<String> giorniPreferiti;

	@ElementCollection
	private Set<String> fasceOrariePreferite;

	@Column(nullable = false)
	private boolean corsoPrivato;

	private Integer frequenzaCorsoPrivato;

	private String tipoCorsoGruppo;

	@ManyToOne
	@JoinColumn(name = "insegnante_id")
	private Insegnante insegnante;  // 🔥 ORA È GIUSTO! `Insegnante` è un'entità separata

	@Column(nullable = false)
	private String tipologiaPagamento;  // Ex "Tipo di iscrizione"

	//Metodo per ottenere i giorni disponibili
	public Set<String> getGiorniDisponibili() {
		return giorniPreferiti;
	}
}
