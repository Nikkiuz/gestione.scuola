package it.Nkkz.gestione.scuola.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "insegnanti")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Insegnante {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String nome;

	@Column(nullable = false)
	private String cognome;

	@Column(nullable = false, unique = true)
	private String email;

	@ElementCollection
	private Set<String> giorniDisponibili;

	@ElementCollection
	private Set<String> fasceOrarieDisponibili;
}
