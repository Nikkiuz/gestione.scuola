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

<<<<<<< Updated upstream
	public StudenteController(StudenteService studenteService) {
=======
	//Costruttore per iniettare i repository e il service
	public StudenteController(
		StudenteService studenteService,
		StudenteRepository studenteRepository,
		CorsoRepository corsoRepository,
		PagamentoRepository pagamentoRepository
	) {
>>>>>>> Stashed changes
		this.studenteService = studenteService;
	}

<<<<<<< Updated upstream
	// ✅ SOLO ADMIN - Recupera tutti gli studenti
=======
	//Recupera tutti gli studenti
>>>>>>> Stashed changes
	@GetMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<StudenteResponseDTO>> getAllStudenti() {
		return ResponseEntity.ok(studenteService.getAllStudenti());
	}

<<<<<<< Updated upstream
	// ✅ SOLO ADMIN - Recupera uno studente per ID
=======
	//Recupera uno studente per ID
>>>>>>> Stashed changes
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<StudenteResponseDTO> getStudenteById(@PathVariable Long id) {
		return ResponseEntity.ok(studenteService.getStudenteById(id));
	}

<<<<<<< Updated upstream
	// ✅ SOLO ADMIN - Recupera studenti per lingua e livello iniziale
=======
	//Recupera studenti per lingua e livello iniziale (ORA SENZA STRINGHE)
>>>>>>> Stashed changes
	@GetMapping("/filtra")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<StudenteResponseDTO>> getStudentiByLinguaELivello(
		@RequestParam String lingua,
<<<<<<< Updated upstream
		@RequestParam String livello) {
		return ResponseEntity.ok(studenteService.getStudentiByLinguaELivello(lingua, livello));
	}

	// ✅ SOLO ADMIN - Recupera gli studenti di un insegnante specifico
=======
		@RequestParam Livello livello) {
		return ResponseEntity.ok(studenteService.getStudentiByLinguaELivello(lingua, livello));
	}

	//Recupera gli studenti di un insegnante specifico
>>>>>>> Stashed changes
	@GetMapping("/insegnante/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<StudenteResponseDTO>> getStudentiByInsegnante(@PathVariable Long id) {
		return ResponseEntity.ok(studenteService.getStudentiByInsegnante(id));
	}

<<<<<<< Updated upstream
	// ✅ SOLO ADMIN - Recupera studenti per tipo di corso (privato o di gruppo)
=======
	//Recupera studenti per tipo di corso (privato o di gruppo)
>>>>>>> Stashed changes
	@GetMapping("/tipo-corso")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<StudenteResponseDTO>> getStudentiByTipoCorso(@RequestParam boolean corsoPrivato) {
		return ResponseEntity.ok(studenteService.getStudentiByTipoCorso(corsoPrivato));
	}

<<<<<<< Updated upstream
	// ✅ SOLO ADMIN - Crea un nuovo studente
=======
	//Crea un nuovo studente
>>>>>>> Stashed changes
	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public StudenteResponseDTO createStudente(@RequestBody StudenteRequestDTO studenteRequestDTO) {
		return studenteService.createStudente(studenteRequestDTO);
	}

<<<<<<< Updated upstream
	// ✅ SOLO ADMIN - Modifica uno studente
=======
	//Modifica uno studente
>>>>>>> Stashed changes
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<StudenteResponseDTO> updateStudente(
		@PathVariable Long id,
		@RequestBody StudenteRequestDTO studenteRequestDTO) {
		return ResponseEntity.ok(studenteService.updateStudente(id, studenteRequestDTO));
	}

<<<<<<< Updated upstream
	// ✅ SOLO ADMIN - Elimina uno studente
=======
	//Elimina uno studente
>>>>>>> Stashed changes
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteStudente(@PathVariable Long id) {
		studenteService.deleteStudente(id);
	}
<<<<<<< Updated upstream
=======

	//Recupera gli studenti senza corso
	@GetMapping("/senza-corso")
	public ResponseEntity<List<Studente>> getStudentiSenzaCorso() {
		List<Studente> studentiSenzaCorso = studenteService.getStudentiSenzaCorso();
		return ResponseEntity.ok(studentiSenzaCorso);
	}

	//Recupera i corsi di uno studente
	@GetMapping("/{id}/corsi")
	public ResponseEntity<List<Corso>> getCorsiStudente(@PathVariable Long id) {
		Studente studente = studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato"));

		return ResponseEntity.ok(studente.getCorsi());
	}

	//Recupera i pagamenti di uno studente
	@GetMapping("/{id}/pagamenti")
	public ResponseEntity<List<Pagamento>> getPagamentiStudente(@PathVariable Long id) {
		List<Pagamento> pagamenti = pagamentoRepository.findByStudenteId(id);
		return ResponseEntity.ok(pagamenti);
	}

	//Rimuove uno studente da un corso
	@DeleteMapping("/{studenteId}/rimuovi-da-corso/{corsoId}")
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

	//Aggiungi un pagamento a uno studente
	@PostMapping("/{id}/pagamenti")
	public ResponseEntity<?> aggiungiPagamento(
		@PathVariable Long id,
		@RequestBody PagamentoRequestDTO pagamentoRequestDTO) {

		// Recuperiamo lo studente dall'ID
		Studente studente = studenteRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Studente non trovato"));

		// Creiamo il nuovo pagamento
		Pagamento nuovoPagamento = new Pagamento();
		nuovoPagamento.setStudente(studente);
		nuovoPagamento.setImporto(pagamentoRequestDTO.getImporto());
		nuovoPagamento.setDataPagamento(pagamentoRequestDTO.getDataPagamento());
		nuovoPagamento.setMensilitaSaldata(pagamentoRequestDTO.getMensilitaSaldata());
		nuovoPagamento.setNumeroRicevuta(pagamentoRequestDTO.getNumeroRicevuta());
		nuovoPagamento.setMetodoPagamento(pagamentoRequestDTO.getMetodoPagamento());
		nuovoPagamento.setNote(pagamentoRequestDTO.getNote());

		pagamentoRepository.save(nuovoPagamento);
		return ResponseEntity.ok(nuovoPagamento);
	}
>>>>>>> Stashed changes
}
