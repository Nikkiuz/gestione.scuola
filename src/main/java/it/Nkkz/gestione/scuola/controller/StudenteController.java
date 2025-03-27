package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.PagamentoRequestDTO;
import it.Nkkz.gestione.scuola.dto.StudenteRequestDTO;
import it.Nkkz.gestione.scuola.dto.StudenteResponseDTO;
import it.Nkkz.gestione.scuola.entity.Corso;
import it.Nkkz.gestione.scuola.entity.Livello;
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
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/studenti")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class StudenteController {

	private final StudenteService studenteService;
	private final StudenteRepository studenteRepository;
	private final CorsoRepository corsoRepository;
	private final PagamentoRepository pagamentoRepository;

	//Costruttore per iniettare i repository e il service
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

	//Recupera tutti gli studenti
	@GetMapping
	public ResponseEntity<List<StudenteResponseDTO>> getAllStudenti() {
		return ResponseEntity.ok(studenteService.getAllStudenti());
	}

	//Recupera uno studente per ID
	@GetMapping("/{id}")
	public ResponseEntity<StudenteResponseDTO> getStudenteById(@PathVariable Long id) {
		return ResponseEntity.ok(studenteService.getStudenteById(id));
	}

	//Recupera studenti per lingua e livello iniziale (ORA SENZA STRINGHE)
	@GetMapping("/filtra")
	public ResponseEntity<List<StudenteResponseDTO>> getStudentiByLinguaELivello(
		@RequestParam String lingua,
		@RequestParam Livello livello) { // ✅ Ora Livello è direttamente un ENUM
		return ResponseEntity.ok(studenteService.getStudentiByLinguaELivello(lingua, livello));
	}

	//Recupera gli studenti di un insegnante specifico
	@GetMapping("/insegnante/{id}")
	public ResponseEntity<List<StudenteResponseDTO>> getStudentiByInsegnante(@PathVariable Long id) {
		return ResponseEntity.ok(studenteService.getStudentiByInsegnante(id));
	}

	//Recupera studenti per tipo di corso (privato o di gruppo)
	@GetMapping("/tipo-corso")
	public ResponseEntity<List<StudenteResponseDTO>> getStudentiByTipoCorso(@RequestParam boolean corsoPrivato) {
		return ResponseEntity.ok(studenteService.getStudentiByTipoCorso(corsoPrivato));
	}

	//Crea un nuovo studente
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public StudenteResponseDTO createStudente(@RequestBody StudenteRequestDTO studenteRequestDTO) {
		return studenteService.createStudente(studenteRequestDTO);
	}

	//Modifica uno studente
	@PutMapping("/{id}")
	public ResponseEntity<StudenteResponseDTO> updateStudente(
		@PathVariable Long id,
		@RequestBody StudenteRequestDTO studenteRequestDTO) {

		System.out.println("📌 updateStudente CHIAMATO con ID: " + id);
		System.out.println("📌 Dati ricevuti: " + studenteRequestDTO);

		return ResponseEntity.ok(studenteService.updateStudente(id, studenteRequestDTO));
	}

	//Elimina uno studente
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteStudente(@PathVariable Long id) {
		studenteService.deleteStudente(id);
	}

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
}
