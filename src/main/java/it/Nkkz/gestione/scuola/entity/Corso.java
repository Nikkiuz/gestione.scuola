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
	private String lingua;

	@Column(nullable = false)
	private String tipoCorso;

	@Column(nullable = false)
	private String frequenza;

	@Column(nullable = false)
	private String giorno;

	@Column(nullable = false)
	private String orario;

	@Column(nullable = false)
	private String livello;

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
}
