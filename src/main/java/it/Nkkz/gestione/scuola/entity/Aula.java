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
<<<<<<< Updated upstream
	private Map<String, String> disponibilita; // Es: {"Lunedì": "10:00-12:00, 14:00-16:00"}
=======
	private Map<String, String> disponibilita;

	public boolean isDisponibile(String giorno, String orario, List<Corso> corsiAttivi) {
		corsiAttivi.stream()
			.filter(c -> c.getAula() != null && c.getAula().getId().equals(this.id))
			.forEach(c -> System.out.println("📌 Corso occupato: " + c.getLingua() + " - " + c.getGiorno() + " - " + c.getOrario()));

		//Controlla se l'aula è già occupata da un corso nello stesso giorno/orario
		boolean eOccupata = corsiAttivi.stream()
			.anyMatch(c -> c.getAula() != null &&
				c.getAula().getId().equals(this.id) &&
				c.getGiorno().equals(giorno) &&
				c.getOrario().equals(orario));

		return !eOccupata;
	}

>>>>>>> Stashed changes
}

