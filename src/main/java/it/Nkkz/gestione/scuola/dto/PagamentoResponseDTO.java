package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.MetodoPagamento;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PagamentoResponseDTO {
	private Long id; // ID del pagamento
	private String studenteNome; // Nome e cognome dello studente
	private LocalDate dataPagamento; // Data del pagamento
	private BigDecimal importo; // Importo pagato
	private String mensilitaSaldata; // Esempio: "Gennaio 2025"
	private MetodoPagamento metodoPagamento; // Bonifico / Carta
	private String numeroRicevuta; // Numero univoco di ricevuta/fattura
}
