package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.entity.Studente;
import it.Nkkz.gestione.scuola.service.StudenteService;
import org.springframework.http.HttpStatus;
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

	// ✅ Crea uno studente
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Studente createStudente(@RequestBody Studente studente) {
		return studenteService.createStudente(studente);
	}

	// ✅ Recupera tutti gli studenti
	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	public List<Studente> getAllStudenti() {
		return studenteService.getAllStudenti();
	}

	// ✅ Recupera uno studente per ID
	@GetMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public Studente getStudenteById(@PathVariable Long id) {
		return studenteService.getStudenteById(id);
	}

	// ✅ Recupera tutti gli studenti che imparano una determinata lingua
	@GetMapping("/lingua/{lingua}")
	@ResponseStatus(HttpStatus.OK)
	public List<Studente> getStudentiByLingua(@PathVariable String lingua) {
		return studenteService.getStudentiByLingua(lingua);
	}

	// ✅ Recupera tutti gli studenti assegnati a un determinato insegnante
	@GetMapping("/insegnante/{id}")
	@ResponseStatus(HttpStatus.OK)
	public List<Studente> getStudentiByInsegnante(@PathVariable Long id) {
		return studenteService.getStudentiByInsegnante(id);
	}

	// ✅ Aggiorna uno studente
	@PutMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public Studente updateStudente(@PathVariable Long id, @RequestBody Studente studenteDetails) {
		return studenteService.updateStudente(id, studenteDetails);
	}

	// ✅ SOLO L'ADMIN può eliminare uno studente
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public void deleteStudente(@PathVariable Long id) {
		studenteService.deleteStudente(id);
	}
}
