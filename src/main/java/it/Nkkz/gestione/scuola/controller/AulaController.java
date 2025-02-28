package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.AulaRequestDTO;
import it.Nkkz.gestione.scuola.dto.AulaResponseDTO;
import it.Nkkz.gestione.scuola.service.AulaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aule")
public class AulaController {

	private final AulaService aulaService;

	public AulaController(AulaService aulaService) {
		this.aulaService = aulaService;
	}

	// ✅ SOLO ADMIN - Recupera tutte le aule
	@GetMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<AulaResponseDTO>> getAllAule() {
		return ResponseEntity.ok(aulaService.getAllAule());
	}

	// ✅ SOLO ADMIN - Recupera un'aula per ID
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<AulaResponseDTO> getAulaById(@PathVariable Long id) {
		return ResponseEntity.ok(aulaService.getAulaById(id));
	}

	// ✅ SOLO ADMIN - Crea un'aula
	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public AulaResponseDTO createAula(@RequestBody AulaRequestDTO aulaRequestDTO) {
		return aulaService.createAula(aulaRequestDTO);
	}

	// ✅ SOLO ADMIN - Modifica un'aula
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<AulaResponseDTO> updateAula(@PathVariable Long id, @RequestBody AulaRequestDTO aulaRequestDTO) {
		return ResponseEntity.ok(aulaService.updateAula(id, aulaRequestDTO));
	}

	// ✅ SOLO ADMIN - Elimina un'aula
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteAula(@PathVariable Long id) {
		aulaService.deleteAula(id);
	}

	// ✅ SOLO ADMIN - Recupera le aule disponibili in un determinato giorno e orario
	@GetMapping("/disponibilita")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<AulaResponseDTO>> getAuleDisponibili(
		@RequestParam String giorno, @RequestParam String orario) {
		return ResponseEntity.ok(aulaService.getAuleDisponibiliByGiornoEOrario(giorno, orario));
	}
}
