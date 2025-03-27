package it.Nkkz.gestione.scuola.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "pagamenti")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pagamento {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "studente_id", nullable = false)
	private Studente studente; // Studente associato al pagamento

	@Column(nullable = false)
	private LocalDate dataPagamento; // Data della transazione

	@Column(nullable = false)
	private double importo; // Importo pagato

	@Column(nullable = false)
	private String mensilitaSaldata; // Mensilità a cui si riferisce il pagamento (es. "Febbraio 2025")

	@Column(nullable = false, unique = true)
	private String numeroRicevuta; // Numero ricevuta/fattura univoco

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MetodoPagamento metodoPagamento; // Metodo di pagamento utilizzato

	private String note; // Eventuali note aggiuntive

}
