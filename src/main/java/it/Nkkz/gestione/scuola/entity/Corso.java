package it.Nkkz.gestione.scuola.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "corsi")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Corso {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private Lingua lingua;

	@Column(nullable = false)
	private String tipoCorso;

	@Column(nullable = false)
	private String frequenza;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Giorno giorno;

	@Column(nullable = false)
	private String orario;

	@Enumerated(EnumType.STRING)
	@Column
	private Giorno secondoGiorno;

	@Column
	private String secondoOrario;


	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Livello livello;

	@ManyToOne
	@JoinColumn(name = "insegnante_id")
	private Insegnante insegnante;

	@ManyToOne
	@JoinColumn(name = "aula_id")
	private Aula aula;

	@ManyToMany
	@JoinTable(
		name = "corso_studenti",
		joinColumns = @JoinColumn(name = "corso_id"),
		inverseJoinColumns = @JoinColumn(name = "studente_id")
	)
	private List<Studente> studenti;

	@Column(nullable = false)
	private boolean attivo = true; // Indica se il corso è attivo o interrotto

	// Costruttore per clonare un corso e assegnare nuovi studenti
	public Corso(Corso corsoOriginale, List<Studente> nuoviStudenti) {
		this.lingua = corsoOriginale.getLingua();
		this.tipoCorso = corsoOriginale.getTipoCorso();
		this.frequenza = corsoOriginale.getFrequenza();
		this.giorno = corsoOriginale.getGiorno();
		this.orario = corsoOriginale.getOrario();
		this.secondoGiorno = corsoOriginale.getSecondoGiorno();
		this.secondoOrario = corsoOriginale.getSecondoOrario();
		this.livello = corsoOriginale.getLivello();
		this.insegnante = corsoOriginale.getInsegnante();
		this.aula = corsoOriginale.getAula();
		this.attivo = true;
		this.studenti = nuoviStudenti;
	}


}
