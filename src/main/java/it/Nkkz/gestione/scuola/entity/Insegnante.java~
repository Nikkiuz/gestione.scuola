package it.Nkkz.gestione.scuola.entity;

import it.Nkkz.gestione.scuola.entity.app_users.AppUser;
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

	@OneToOne
	@JoinColumn(name = "utente_id", nullable = false)
	private AppUser utente;  // Collegamento all'account utente

	@ElementCollection
	private Set<String> giorniDisponibili;  // Es. ["Lunedì", "Mercoledì"]

	@ElementCollection
	private Set<String> fasceOrarieDisponibili;  // Es. ["16:00-18:00", "18:00-20:00"]

	public String getNome() {
		return utente.getUsername();
	}

	public String getEmail() {
		return utente.getEmail();
	}
}
