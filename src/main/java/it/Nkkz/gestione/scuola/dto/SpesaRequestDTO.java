package it.Nkkz.gestione.scuola.dto;

import it.Nkkz.gestione.scuola.entity.Spesa.CategoriaSpesa;
import lombok.Data;
import java.time.LocalDate;

@Data
public class SpesaRequestDTO {
	private CategoriaSpesa categoria;
	private double importo;
	private LocalDate dataSpesa;
	private String descrizione;
}
