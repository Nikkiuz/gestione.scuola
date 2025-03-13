package it.Nkkz.gestione.scuola.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PagamentoMensileDTO {
	private List<String> mesi;
	private List<Double> importi;
}

