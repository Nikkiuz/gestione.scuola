package it.Nkkz.gestione.scuola.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "spese")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Spesa {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private CategoriaSpesa categoria;

	@Column(nullable = false)
	private double importo;

	@Column(nullable = false)
	private LocalDate dataSpesa;

	private String descrizione;

	// Enum per le categorie di spesa
	public enum CategoriaSpesa {
		BOLLETTE,
		PULIZIA,
		MUTUO,
		CONTRIBUTI_INSEGNANTI,
		CANCELLERIA,
		COMMERCIALISTA,
		ALTRO
	}

}
