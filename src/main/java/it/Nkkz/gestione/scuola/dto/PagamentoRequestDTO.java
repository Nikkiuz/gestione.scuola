package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.MetodoPagamento;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PagamentoRequestDTO {
	private Long studenteId;  // ID dello studente che effettua il pagamento
	private LocalDate dataPagamento; // Data del pagamento
	private double importo; // Importo pagato
	private String mensilitaSaldata; // Esempio: "Gennaio 2025"
	private MetodoPagamento metodoPagamento; // Bonifico / Carta
	private String numeroRicevuta;
	private String note;
}
