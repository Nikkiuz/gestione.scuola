package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.entity.Studente;
import it.Nkkz.gestione.scuola.service.StudenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studenti")
public class StudenteController {

	private final StudenteService studenteService;

	public StudenteController(StudenteService studenteService) {
		this.studenteService = studenteService;
	}

	@PostMapping
	public ResponseEntity<Studente> createStudente(@RequestBody Studente studente) {
		return ResponseEntity.ok(studenteService.saveStudente(studente));
	}

	@GetMapping
	public ResponseEntity<List<Studente>> getAllStudenti() {
		return ResponseEntity.ok(studenteService.getAllStudenti());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Studente> getStudenteById(@PathVariable Long id) {
		return ResponseEntity.ok(studenteService.getStudenteById(id));
	}

	@GetMapping("/lingua/{lingua}")
	public ResponseEntity<List<Studente>> getStudentiByLingua(@PathVariable String lingua) {
		return ResponseEntity.ok(studenteService.getStudentiByLingua(lingua));
	}

	@GetMapping("/insegnante/{id}")
	public ResponseEntity<List<Studente>> getStudentiByInsegnante(@PathVariable Long id) {
		return ResponseEntity.ok(studenteService.getStudentiByInsegnante(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Studente> updateStudente(@PathVariable Long id, @RequestBody Studente studenteDetails) {
		return ResponseEntity.ok(studenteService.updateStudente(id, studenteDetails));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteStudente(@PathVariable Long id) {
		studenteService.deleteStudente(id);
		return ResponseEntity.ok("Studente eliminato con successo");
	}
}
