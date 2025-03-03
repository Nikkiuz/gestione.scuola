package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.SpesaRequestDTO;
import it.Nkkz.gestione.scuola.dto.SpesaResponseDTO;
import it.Nkkz.gestione.scuola.service.SpesaService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spese")
public class SpesaController {

	private final SpesaService spesaService;

	public SpesaController(SpesaService spesaService) {
		this.spesaService = spesaService;
	}

	// Recupera tutte le spese (solo ADMIN)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping
	public List<SpesaResponseDTO> getAllSpese() {
		return spesaService.getAllSpese();
	}

	// Recupera una spesa per ID (solo ADMIN)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/{id}")
	public SpesaResponseDTO getSpesaById(@PathVariable Long id) {
		return spesaService.getSpesaById(id);
	}

	// Aggiunge una nuova spesa (solo ADMIN)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public SpesaResponseDTO createSpesa(@RequestBody SpesaRequestDTO dto) {
		return spesaService.createSpesa(dto);
	}

	// Modifica una spesa esistente (solo ADMIN)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PutMapping("/{id}")
	public SpesaResponseDTO updateSpesa(@PathVariable Long id, @RequestBody SpesaRequestDTO dto) {
		return spesaService.updateSpesa(id, dto);
	}

	// Elimina una spesa (solo ADMIN)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteSpesa(@PathVariable Long id) {
		spesaService.deleteSpesa(id);
	}
}
