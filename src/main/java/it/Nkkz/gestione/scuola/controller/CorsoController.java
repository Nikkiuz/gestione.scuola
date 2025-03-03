package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.CorsoRequestDTO;
import it.Nkkz.gestione.scuola.dto.CorsoResponseDTO;
import it.Nkkz.gestione.scuola.service.CorsoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/corsi")
public class CorsoController {

	@Autowired
	private CorsoService corsoService;

	// ✅ Recupera tutti i corsi (solo Admin)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping
	public ResponseEntity<List<CorsoResponseDTO>> getTuttiICorsi() {
		return ResponseEntity.ok(corsoService.getTuttiICorsi());
	}

	// ✅ Recupera corsi per insegnante
	@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_INSEGNANTE')")
	@GetMapping("/insegnante/{id}")
	public ResponseEntity<List<CorsoResponseDTO>> getCorsiByInsegnante(@PathVariable Long id) {
		return ResponseEntity.ok(corsoService.getCorsiByInsegnante(id));
	}

	// ✅ Recupera corsi per giorno e orario
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/giorno-orario")
	public ResponseEntity<List<CorsoResponseDTO>> getCorsiByGiornoEOrario(@RequestParam String giorno, @RequestParam String orario) {
		return ResponseEntity.ok(corsoService.getCorsiByGiornoEOrario(giorno, orario));
	}

	// ✅ Recupera corsi per lingua e livello
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/lingua-livello")
	public ResponseEntity<List<CorsoResponseDTO>> getCorsiByLinguaELivello(@RequestParam String lingua, @RequestParam String livello) {
		return ResponseEntity.ok(corsoService.getCorsiByLinguaELivello(lingua, livello));
	}

	// ✅ Recupera corsi per tipologia (privati o di gruppo)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/tipologia")
	public ResponseEntity<List<CorsoResponseDTO>> getCorsiByTipologia(@RequestParam String tipoCorso) {
		return ResponseEntity.ok(corsoService.getCorsiByTipologia(tipoCorso));
	}

	// ✅ Crea un nuovo corso (solo Admin)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping
	public ResponseEntity<CorsoResponseDTO> creaCorso(@RequestBody CorsoRequestDTO request) {
		return ResponseEntity.ok(corsoService.creaCorso(request));
	}

	// ✅ Modifica un corso esistente (solo Admin)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PutMapping("/{id}")
	public ResponseEntity<CorsoResponseDTO> modificaCorso(@PathVariable Long id, @RequestBody CorsoRequestDTO request) {
		return ResponseEntity.ok(corsoService.modificaCorso(id, request));
	}

	// ✅ Interrompe un corso (senza eliminarlo) - solo Admin
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PutMapping("/{id}/interrompi")
	public ResponseEntity<String> interrompiCorso(@PathVariable Long id) {
		corsoService.interrompiCorso(id);
		return ResponseEntity.ok("Corso interrotto con successo.");
	}

	// ✅ Elimina un corso definitivamente (solo Admin)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<String> eliminaCorso(@PathVariable Long id) {
		corsoService.eliminaCorso(id);
		return ResponseEntity.ok("Corso eliminato con successo.");
	}

	// ✅ Gestione corsi pieni - Admin sceglie se dividere il corso o aggiungere un posto extra
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping("/{id}/gestisci-pieno")
	public ResponseEntity<String> gestisciCorsoPieno(@PathVariable Long id, @RequestParam int scelta) {
		corsoService.gestisciCorsoPieno(id, scelta);
		return ResponseEntity.ok("Operazione eseguita con successo.");
	}

	// ✅ Genera corsi automaticamente basandosi su preferenze, livello e età (solo Admin)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping("/genera-automatico")
	public ResponseEntity<String> generaCorsiAutomaticamente() {
		corsoService.generaCorsiAutomaticamente();
		return ResponseEntity.ok("Corsi generati automaticamente.");
	}
}
