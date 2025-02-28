package it.Nkkz.gestione.scuola.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Map;

@Entity
@Table(name = "aule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aula {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nome;
	private int capienzaMax;

	@ElementCollection
	@CollectionTable(name = "aula_disponibilita", joinColumns = @JoinColumn(name = "aula_id"))
	@MapKeyColumn(name = "giorno")
	@Column(name = "orari_disponibili")
	private Map<String, String> disponibilita; // Es: {"Lunedì": "10:00-12:00, 14:00-16:00"}
}

