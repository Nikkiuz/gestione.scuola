package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.PagamentoRequestDTO;
import it.Nkkz.gestione.scuola.dto.PagamentoResponseDTO;
import it.Nkkz.gestione.scuola.service.PagamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagamenti")
@RequiredArgsConstructor
public class PagamentoController {

	private final PagamentoService pagamentoService;

	// ✅ Registra un nuovo pagamento (Solo Admin)
	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public PagamentoResponseDTO registraPagamento(@RequestBody PagamentoRequestDTO requestDTO) {
		return pagamentoService.registraPagamento(requestDTO);
	}

	// ✅ Recupera tutti i pagamenti (Solo Admin)
	@GetMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.OK)
	public List<PagamentoResponseDTO> getTuttiIPagamenti() {
		return pagamentoService.getTuttiIPagamenti();
	}

	// ✅ Recupera i pagamenti di uno studente specifico (Solo Admin)
	@GetMapping("/studente/{studenteId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.OK)
	public List<PagamentoResponseDTO> getPagamentiByStudente(@PathVariable Long studenteId) {
		return pagamentoService.getPagamentiByStudente(studenteId);
	}

	// ✅ Recupera i pagamenti per una mensilità specifica (Solo Admin)
	@GetMapping("/mensilita/{mensilita}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.OK)
	public List<PagamentoResponseDTO> getPagamentiByMensilita(@PathVariable String mensilita) {
		return pagamentoService.getPagamentiByMensilita(mensilita);
	}

	// ✅ Elimina un pagamento (Solo Admin)
	@DeleteMapping("/{pagamentoId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void eliminaPagamento(@PathVariable Long pagamentoId) {
		pagamentoService.eliminaPagamento(pagamentoId);
	}
}
