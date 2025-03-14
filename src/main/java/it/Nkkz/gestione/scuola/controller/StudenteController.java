package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.StudenteRequestDTO;
import it.Nkkz.gestione.scuola.dto.StudenteResponseDTO;
import it.Nkkz.gestione.scuola.entity.Corso;
import it.Nkkz.gestione.scuola.entity.Pagamento;
import it.Nkkz.gestione.scuola.entity.Studente;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
import it.Nkkz.gestione.scuola.repository.PagamentoRepository;
import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import it.Nkkz.gestione.scuola.service.StudenteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studenti")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class StudenteController {

	private final StudenteService studenteService;
	private final StudenteRepository studenteRepository;
	private final CorsoRepository corsoRepository;
	private final PagamentoRepository pagamentoRepository;

	// 🔹 Costruttore per iniettare i repository e il service
	public StudenteController(
		StudenteService studenteService,
		StudenteRepository studenteRepository,
		CorsoRepository corsoRepository,
		PagamentoRepository pagamentoRepository
	) {
		this.studenteService = studenteService;
		this.studenteRepository = studenteRepository;
		this.corsoRepository = corsoRepository;
		this.pagamentoRepository = pagamentoRepository;
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

	// ✅ Recupera gli studenti senza corso
	@GetMapping("/senza-corso")
	public ResponseEntity<List<Studente>> getStudentiSenzaCorso() {
		List<Studente> studentiSenzaCorso = studenteService.getStudentiSenzaCorso();
		return ResponseEntity.ok(studentiSenzaCorso);
	}

	// ✅ Recupera i corsi di uno studente
	@GetMapping("/{id}/corsi")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<Corso>> getCorsiStudente(@PathVariable Long id) {
		Studente studente = studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato"));

		return ResponseEntity.ok(studente.getCorsi());
	}

	// ✅ Recupera i pagamenti di uno studente
	@GetMapping("/{id}/pagamenti")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<Pagamento>> getPagamentiStudente(@PathVariable Long id) {
		List<Pagamento> pagamenti = pagamentoRepository.findByStudenteId(id);
		return ResponseEntity.ok(pagamenti);
	}

	// ✅ Rimuove uno studente da un corso
	@DeleteMapping("/{studenteId}/rimuovi-da-corso/{corsoId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<?> rimuoviStudenteDaCorso(@PathVariable Long studenteId, @PathVariable Long corsoId) {
		Studente studente = studenteRepository.findById(studenteId)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato"));
		Corso corso = corsoRepository.findById(corsoId)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		corso.getStudenti().remove(studente);
		studente.getCorsi().remove(corso);

		corsoRepository.save(corso);
		studenteRepository.save(studente);

		return ResponseEntity.ok("Studente rimosso dal corso");
	}

	// ✅ Aggiungi un pagamento a uno studente
	@PostMapping("/{id}/pagamenti")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Pagamento> aggiungiPagamento(@PathVariable Long id, @RequestBody Pagamento nuovoPagamento) {
		Studente studente = studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato"));

		nuovoPagamento.setStudente(studente);
		pagamentoRepository.save(nuovoPagamento);
		return ResponseEntity.ok(nuovoPagamento);
	}


}
