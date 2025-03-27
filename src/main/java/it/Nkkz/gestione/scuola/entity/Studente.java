package it.Nkkz.gestione.scuola.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
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

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Livello livello;

	@ElementCollection
	private Set<String> giorniPreferiti;

	@ElementCollection
	private Set<String> fasceOrariePreferite;

	@Column(nullable = false)
	private boolean corsoPrivato;

	private Integer frequenzaCorsoPrivato;

	private String tipoCorsoGruppo;

	@ManyToMany(mappedBy = "studenti")
	private List<Corso> corsi = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "insegnante_id")
	private Insegnante insegnante;  //

	@Column(nullable = false)
	private String tipologiaIscrizione;

	//Metodo per ottenere i giorni disponibili
	public Set<String> getGiorniDisponibili() {
		return giorniPreferiti;
	}

}
