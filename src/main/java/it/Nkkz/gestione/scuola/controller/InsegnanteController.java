package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.InsegnanteRequestDTO;
import it.Nkkz.gestione.scuola.dto.InsegnanteResponseDTO;
import it.Nkkz.gestione.scuola.service.InsegnanteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insegnanti")
public class InsegnanteController {

	private final InsegnanteService insegnanteService;

	public InsegnanteController(InsegnanteService insegnanteService) {
		this.insegnanteService = insegnanteService;
	}

	//SOLO ADMIN - Recupera tutti gli insegnanti
	@GetMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<InsegnanteResponseDTO>> getAllInsegnanti() {
		return ResponseEntity.ok(insegnanteService.getAllInsegnanti());
	}

	//ADMIN - Recupera un insegnante per ID
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN') or #id == authentication.principal.id")
	public ResponseEntity<InsegnanteResponseDTO> getInsegnanteById(@PathVariable Long id, Authentication authentication) {
		return ResponseEntity.ok(insegnanteService.getInsegnanteById(id));
	}

	//SOLO ADMIN - Crea un nuovo insegnante
	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public InsegnanteResponseDTO createInsegnante(@RequestBody InsegnanteRequestDTO insegnanteRequestDTO) {
		return insegnanteService.createInsegnante(insegnanteRequestDTO);
	}

	//ADMIN - Modifica qualsiasi insegnante | INSEGNANTE - Modifica solo se stesso
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN') or #id == authentication.principal.id")
	public ResponseEntity<InsegnanteResponseDTO> updateInsegnante(
		@PathVariable Long id,
		@RequestBody InsegnanteRequestDTO insegnanteRequestDTO,
		Authentication authentication) {
		return ResponseEntity.ok(insegnanteService.updateInsegnante(id, insegnanteRequestDTO));
	}

	//SOLO ADMIN - Elimina un insegnante
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteInsegnante(@PathVariable Long id) {
		insegnanteService.deleteInsegnante(id);
	}
}
