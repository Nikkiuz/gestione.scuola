package it.Nkkz.gestione.scuola.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AulaResponseDTO {
	private Long id;
	private String nome;
	private int capienzaMax;
	private Map<String, String> disponibilita;
}
