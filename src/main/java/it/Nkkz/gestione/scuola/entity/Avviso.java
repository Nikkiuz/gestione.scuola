package it.Nkkz.gestione.scuola.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "avvisi")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Avviso {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String messaggio;

	@Column(nullable = false)
	private String link; // Link per navigare dall'avviso alla sezione corretta

	@Column(nullable = false)
	private LocalDate dataCreazione = LocalDate.now(); // Data automatica alla creazione

	// Costruttore rapido per creare nuovi avvisi
	public Avviso(String messaggio, String link) {
		this.messaggio = messaggio;
		this.link = link;
		this.dataCreazione = LocalDate.now();
	}
}

