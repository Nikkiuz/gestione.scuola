package it.Nkkz.gestione.scuola.dto;

import lombok.Data;
import java.util.Map;

@Data
public class ReportDTO {
	private Map<String, Integer> oreInsegnate; // Nome Insegnante -> Ore totali
	private Map<String, Double> pagamentiRicevuti; // Metodo di pagamento -> Totale €
	private Map<String, Double> speseRegistrate; // Categoria Spesa -> Totale €
	private double bilancio; // Entrate - Uscite
	private String periodo; // "Mensile" o "Annuale"
	private double totaleEntrate;
	private double totaleUscite;
	private int totaleOreInsegnate;
}
