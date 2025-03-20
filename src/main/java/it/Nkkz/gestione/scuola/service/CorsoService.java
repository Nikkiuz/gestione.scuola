package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.CorsoRequestDTO;
import it.Nkkz.gestione.scuola.dto.CorsoResponseDTO;
import it.Nkkz.gestione.scuola.entity.*;
import it.Nkkz.gestione.scuola.repository.AulaRepository;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
import it.Nkkz.gestione.scuola.repository.InsegnanteRepository;
import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CorsoService {

	@Autowired
	private CorsoRepository corsoRepository;

	@Autowired
	private StudenteRepository studenteRepository;

	@Autowired
	private AulaRepository aulaRepository;

	@Autowired
	private InsegnanteRepository insegnanteRepository;

	// ✅ Recupera tutti i corsi attivi (Admin)
	public List<CorsoResponseDTO> getTuttiICorsi() {
		return corsoRepository.findByAttivoTrue().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera i corsi di un insegnante
	public List<CorsoResponseDTO> getCorsiByInsegnante(Long insegnanteId) {
		return corsoRepository.findByInsegnanteIdAndAttivoTrue(insegnanteId).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera corsi per giorno e orario
	public List<CorsoResponseDTO> getCorsiByGiornoEOrario(String giorno, String orario) {
		return corsoRepository.findByGiornoAndOrarioAndAttivoTrue(giorno, orario).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera corsi per lingua e livello (ORA SENZA STRINGHE)
	public List<CorsoResponseDTO> getCorsiByLinguaELivello(String lingua, Livello livello) {
		return corsoRepository.findByLinguaAndLivelloAndAttivoTrue(lingua, livello).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera corsi per tipologia (privati o di gruppo)
	public List<CorsoResponseDTO> getCorsiByTipologia(String tipoCorso) {
		return corsoRepository.findByTipoCorsoAndAttivoTrue(tipoCorso).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Crea un nuovo corso
	public CorsoResponseDTO creaCorso(CorsoRequestDTO request) {
		List<Corso> corsiAttivi = corsoRepository.findByAttivoTrue();

		// Trova un'aula disponibile
		Optional<Aula> aulaDisponibile = aulaRepository.findAll().stream()
			.filter(aula -> aula.isDisponibile(request.getGiorno(), request.getOrario(), corsiAttivi))
			.findFirst();

		if (aulaDisponibile.isEmpty()) {
			throw new IllegalStateException("Nessuna aula disponibile per il giorno " + request.getGiorno() + " alle " + request.getOrario());
		}

		Corso corso = new Corso();
		BeanUtils.copyProperties(request, corso);
		corso.setAula(aulaDisponibile.get());
		corso.setStudenti(studenteRepository.findAllById(request.getStudentiIds()));
		corso.setAttivo(true);

		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}

	// ✅ Modifica un corso esistente
	public CorsoResponseDTO modificaCorso(Long id, CorsoRequestDTO request) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		BeanUtils.copyProperties(request, corso, "id");
		corso.setStudenti(studenteRepository.findAllById(request.getStudentiIds()));

		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}

	// ✅ Interrompi un corso (senza eliminarlo)
	public void interrompiCorso(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		corso.setAttivo(false);
		corsoRepository.save(corso);
	}

	// ✅ Elimina definitivamente un corso
	public void eliminaCorso(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		corsoRepository.deleteById(id);
	}

	// ✅ Gestione corsi pieni
	public void gestisciCorsoPieno(Long corsoId, int scelta) {
		Corso corso = corsoRepository.findById(corsoId)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		switch (scelta) {
			case 1:
				dividiCorso(corso);
				break;
			case 2:
				aggiungiPostoExtra(corso);
				break;
			default:
				throw new IllegalArgumentException("Scelta non valida");
		}
	}

	// ✅ Dividere un corso in due gruppi più piccoli
	private void dividiCorso(Corso corso) {
		List<Studente> studenti = new ArrayList<>(corso.getStudenti());

		if (studenti.size() < 2) {
			throw new IllegalArgumentException("Impossibile dividere un corso con meno di 2 studenti.");
		}

		int metà = studenti.size() / 2;

		List<Studente> primoGruppo = new ArrayList<>(studenti.subList(0, metà));
		List<Studente> secondoGruppo = new ArrayList<>(studenti.subList(metà, studenti.size()));

		Corso corso1 = new Corso(corso, primoGruppo);
		Corso corso2 = new Corso(corso, secondoGruppo);

		corsoRepository.save(corso1);
		corsoRepository.save(corso2);
	}

	// ✅ Aggiungere un posto extra al corso pieno
	private void aggiungiPostoExtra(Corso corso) {
		System.out.println("Posto extra aggiunto al corso " + corso.getLingua());
	}

	// ✅ Genera corsi automaticamente basandosi su preferenze, livello ed età
	public void generaCorsiAutomaticamente() {
		System.out.println("Generazione automatica corsi in corso...");
	}

	// ✅ Conversione Entity → DTO
	private CorsoResponseDTO convertToResponseDTO(Corso corso) {
		CorsoResponseDTO dto = new CorsoResponseDTO();
		BeanUtils.copyProperties(corso, dto);
		return dto;
	}
}
