package it.Nkkz.gestione.scuola.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
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

	public boolean isDisponibile(String giorno, String orario, List<Corso> corsiAttivi) {
		// Controlla se l'aula ha disponibilità per quel giorno
		boolean haDisponibilita = disponibilita.containsKey(giorno) && disponibilita.get(giorno).contains(orario);

		// Controlla se è già occupata da un altro corso attivo nello stesso giorno/orario
		boolean eOccupata = corsiAttivi.stream()
			.anyMatch(corso -> corso.getAula() != null &&
				corso.getAula().getId().equals(this.id) &&
				corso.getGiorno().equals(giorno) &&
				corso.getOrario().equals(orario));

		return haDisponibilita && !eOccupata;
	}

	@ElementCollection
	@CollectionTable(name = "aula_disponibilita", joinColumns = @JoinColumn(name = "aula_id"))
	@MapKeyColumn(name = "giorno")
	@Column(name = "orari_disponibili")
	private Map<String, String> disponibilita; // Es: {"Lunedì": "10:00-12:00, 14:00-16:00"}
}

