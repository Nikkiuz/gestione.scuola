package it.Nkkz.gestione.scuola.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Arrays;
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

	@ElementCollection
	@CollectionTable(name = "aula_disponibilita", joinColumns = @JoinColumn(name = "aula_id"))
	@MapKeyColumn(name = "giorno")
	@Column(name = "orari_disponibili")
	private Map<String, String> disponibilita; // Es: {"Lunedì": "10:00-12:00, 14:00-16:00"}

	public boolean isDisponibile(String giorno, String orario, List<Corso> corsiAttivi) {
		// 🔍 Debug: verifica che i corsi attivi siano considerati
		System.out.println("🔍 Controllo disponibilità per aula '" + nome + "'");
		System.out.println("🗓️ Giorno richiesto: " + giorno + ", Orario richiesto: " + orario);
		System.out.println("📅 Corsi attivi che usano questa aula: ");
		corsiAttivi.stream()
			.filter(c -> c.getAula() != null && c.getAula().getId().equals(this.id))
			.forEach(c -> System.out.println("📌 Corso occupato: " + c.getLingua() + " - " + c.getGiorno() + " - " + c.getOrario()));

		// ✅ Controlla se l'aula è già occupata da un corso nello stesso giorno/orario
		boolean eOccupata = corsiAttivi.stream()
			.anyMatch(c -> c.getAula() != null &&
				c.getAula().getId().equals(this.id) &&
				c.getGiorno().equals(giorno) &&
				c.getOrario().equals(orario));

		// 🔍 Log finale
		System.out.println("✅ Aula disponibile? " + !eOccupata);

		return !eOccupata;
	}

}

