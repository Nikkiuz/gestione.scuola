package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.CorsoRequestDTO;
import it.Nkkz.gestione.scuola.dto.CorsoResponseDTO;
import it.Nkkz.gestione.scuola.service.CorsoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/corsi")
public class CorsoController {

	private final CorsoService corsoService;

	public CorsoController(CorsoService corsoService) {
		this.corsoService = corsoService;
	}

	// ✅ Recupera tutti i corsi (solo Admin)
	@GetMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public List<CorsoResponseDTO> getTuttiICorsi() {
		return corsoService.getTuttiICorsi();
	}

	// ✅ Recupera i corsi di un insegnante specifico (solo per l'insegnante stesso o Admin)
	@GetMapping("/insegnante/{insegnanteId}")
	@PreAuthorize("hasRole('ROLE_ADMIN') or authentication.principal.id == #insegnanteId")
	public List<CorsoResponseDTO> getCorsiByInsegnante(@PathVariable Long insegnanteId) {
		return corsoService.getCorsiByInsegnante(insegnanteId);
	}

	// ✅ Recupera i corsi per giorno e orario
	@GetMapping("/orario")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public List<CorsoResponseDTO> getCorsiByGiornoEOrario(@RequestParam String giorno, @RequestParam String orario) {
		return corsoService.getCorsiByGiornoEOrario(giorno, orario);
	}

	// ✅ Recupera i corsi per lingua e livello (Admin)
	@GetMapping("/lingua")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public List<CorsoResponseDTO> getCorsiByLinguaELivello(@RequestParam String lingua, @RequestParam String livello) {
		return corsoService.getCorsiByLinguaELivello(lingua, livello);
	}

	// ✅ Recupera corsi privati o di gruppo
	@GetMapping("/tipologia")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public List<CorsoResponseDTO> getCorsiByTipologia(@RequestParam String tipoCorso) {
		return corsoService.getCorsiByTipologia(tipoCorso);
	}

	// ✅ Crea un nuovo corso (solo Admin)
	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public CorsoResponseDTO creaCorso(@Valid @RequestBody CorsoRequestDTO request) {
		return corsoService.creaCorso(request);
	}

	// ✅ Modifica un corso esistente (solo Admin)
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.OK)
	public CorsoResponseDTO modificaCorso(@PathVariable Long id, @Valid @RequestBody CorsoRequestDTO request) {
		return corsoService.modificaCorso(id, request);
	}

	// ✅ Elimina un corso (solo Admin)
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void eliminaCorso(@PathVariable Long id) {
		corsoService.eliminaCorso(id);
	}

	// ✅ Gestione dei corsi pieni: Admin decide come procedere
	@PostMapping("/{id}/gestisci-corso-pieno")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.OK)
	public void gestisciCorsoPieno(@PathVariable Long id, @RequestParam int scelta) {
		corsoService.gestisciCorsoPieno(id, scelta);
	}

	// ✅ **Generazione automatica dei corsi** basata su preferenze, livello e età
	@PostMapping("/genera-corsi")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public void generaCorsiAutomaticamente() {
		corsoService.generaCorsiAutomaticamente();
	}
}
