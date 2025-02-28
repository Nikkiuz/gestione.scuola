package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.StudenteRequestDTO;
import it.Nkkz.gestione.scuola.dto.StudenteResponseDTO;
import it.Nkkz.gestione.scuola.service.StudenteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studenti")
public class StudenteController {

	private final StudenteService studenteService;

	public StudenteController(StudenteService studenteService) {
		this.studenteService = studenteService;
	}

	// ✅ SOLO ADMIN - Recupera tutti gli studenti
	@GetMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<StudenteResponseDTO>> getAllStudenti() {
		return ResponseEntity.ok(studenteService.getAllStudenti());
	}

	// ✅ SOLO ADMIN - Recupera uno studente per ID
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<StudenteResponseDTO> getStudenteById(@PathVariable Long id) {
		return ResponseEntity.ok(studenteService.getStudenteById(id));
	}

	// ✅ SOLO ADMIN - Recupera studenti per lingua e livello iniziale
	@GetMapping("/filtra")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<StudenteResponseDTO>> getStudentiByLinguaELivello(
		@RequestParam String lingua,
		@RequestParam String livello) {
		return ResponseEntity.ok(studenteService.getStudentiByLinguaELivello(lingua, livello));
	}

	// ✅ SOLO ADMIN - Recupera gli studenti di un insegnante specifico
	@GetMapping("/insegnante/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<StudenteResponseDTO>> getStudentiByInsegnante(@PathVariable Long id) {
		return ResponseEntity.ok(studenteService.getStudentiByInsegnante(id));
	}

	// ✅ SOLO ADMIN - Recupera studenti per tipo di corso (privato o di gruppo)
	@GetMapping("/tipo-corso")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<StudenteResponseDTO>> getStudentiByTipoCorso(@RequestParam boolean corsoPrivato) {
		return ResponseEntity.ok(studenteService.getStudentiByTipoCorso(corsoPrivato));
	}

	// ✅ SOLO ADMIN - Crea un nuovo studente
	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public StudenteResponseDTO createStudente(@RequestBody StudenteRequestDTO studenteRequestDTO) {
		return studenteService.createStudente(studenteRequestDTO);
	}

	// ✅ SOLO ADMIN - Modifica uno studente
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<StudenteResponseDTO> updateStudente(
		@PathVariable Long id,
		@RequestBody StudenteRequestDTO studenteRequestDTO) {
		return ResponseEntity.ok(studenteService.updateStudente(id, studenteRequestDTO));
	}

	// ✅ SOLO ADMIN - Elimina uno studente
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteStudente(@PathVariable Long id) {
		studenteService.deleteStudente(id);
	}
}
