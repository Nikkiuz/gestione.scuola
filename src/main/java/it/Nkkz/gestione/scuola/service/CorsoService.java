package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.CorsoRequestDTO;
import it.Nkkz.gestione.scuola.dto.CorsoResponseDTO;
import it.Nkkz.gestione.scuola.entity.Aula;
import it.Nkkz.gestione.scuola.entity.Corso;
import it.Nkkz.gestione.scuola.entity.Studente;
import it.Nkkz.gestione.scuola.repository.AulaRepository;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
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

	// ✅ Recupera tutti i corsi (Admin)
	public List<CorsoResponseDTO> getTuttiICorsi() {
		return corsoRepository.findAll().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera i corsi di un insegnante specifico
	public List<CorsoResponseDTO> getCorsiByInsegnante(Long insegnanteId) {
		return corsoRepository.findByInsegnanteId(insegnanteId).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera corsi per giorno e orario
	public List<CorsoResponseDTO> getCorsiByGiornoEOrario(String giorno, String orario) {
		return corsoRepository.findByGiornoAndOrario(giorno, orario).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera corsi per lingua e livello
	public List<CorsoResponseDTO> getCorsiByLinguaELivello(String lingua, String livello) {
		return corsoRepository.findByLinguaAndLivello(lingua, livello).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera corsi privati o di gruppo
	public List<CorsoResponseDTO> getCorsiByTipologia(String tipoCorso) {
		return corsoRepository.findByTipoCorso(tipoCorso).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Crea un nuovo corso (Admin)
	public CorsoResponseDTO creaCorso(CorsoRequestDTO request) {
		Corso corso = new Corso();
		BeanUtils.copyProperties(request, corso);
		corso.setStudenti(studenteRepository.findAllById(request.getStudentiIds()));

		// Assegna automaticamente un'aula disponibile
		Optional<Aula> aulaDisponibile = aulaRepository.findById(request.getAulaId());
		aulaDisponibile.ifPresent(corso::setAula);

		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}

	// ✅ Modifica un corso esistente (Admin)
	public CorsoResponseDTO modificaCorso(Long id, CorsoRequestDTO request) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		BeanUtils.copyProperties(request, corso, "id");
		corso.setStudenti(studenteRepository.findAllById(request.getStudentiIds()));

		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}

	// ✅ Elimina un corso (Admin)
	public void eliminaCorso(Long id) {
		if (!corsoRepository.existsById(id)) {
			throw new EntityNotFoundException("Corso non trovato");
		}
		corsoRepository.deleteById(id);
	}

	// ✅ Gestione corsi pieni: Admin decide come procedere
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

		int numeroStudentiPrimoGruppo = studenti.size() / 2;

		List<Studente> primoGruppo = new ArrayList<>(studenti.subList(0, numeroStudentiPrimoGruppo));
		List<Studente> secondoGruppo = new ArrayList<>(studenti.subList(numeroStudentiPrimoGruppo, studenti.size()));

		// 🔹 Creiamo i nuovi corsi con nomi più chiari
		Corso corso1 = new Corso();
		corso1.setLingua(corso.getLingua());
		corso1.setTipoCorso(corso.getTipoCorso());
		corso1.setFrequenza(corso.getFrequenza());
		corso1.setGiorno(corso.getGiorno());
		corso1.setOrario(corso.getOrario());
		corso1.setInsegnante(corso.getInsegnante());
		corso1.setStudenti(primoGruppo);

		Corso corso2 = new Corso();
		corso2.setLingua(corso.getLingua());
		corso2.setTipoCorso(corso.getTipoCorso());
		corso2.setFrequenza(corso.getFrequenza());
		corso2.setGiorno(corso.getGiorno());
		corso2.setOrario(corso.getOrario());
		corso2.setInsegnante(corso.getInsegnante());
		corso2.setStudenti(secondoGruppo);

		// 🔹 Assegna le aule disponibili
		Optional<Aula> aulaDisponibile1 = aulaRepository.findAuleDisponibiliByGiornoEOrario(corso.getGiorno(), corso.getOrario()).stream().findFirst();
		aulaDisponibile1.ifPresent(corso1::setAula);

		Optional<Aula> aulaDisponibile2 = aulaRepository.findAuleDisponibiliByGiornoEOrario(corso.getGiorno(), corso.getOrario()).stream().findFirst();
		aulaDisponibile2.ifPresent(corso2::setAula);

		// 🔹 Salvataggio
		corsoRepository.save(corso1);
		corsoRepository.save(corso2);

		System.out.println("Il corso è stato diviso in due gruppi.");
	}



	// ✅ Aggiungere un posto extra al corso pieno
	private void aggiungiPostoExtra(Corso corso) {
		System.out.println("Posto extra aggiunto al corso " + corso.getLingua());
	}

	// ✅ Generazione automatica dei corsi basata su preferenze, livello, età
	public void generaCorsiAutomaticamente() {
		List<Studente> studenti = studenteRepository.findAll();

		Map<String, List<Studente>> gruppi = studenti.stream()
			.collect(Collectors.groupingBy(s -> s.getLinguaDaImparare() + "-" + s.getLivello() + "-" + (s.getEta() / 3)));

		for (Map.Entry<String, List<Studente>> entry : gruppi.entrySet()) {
			List<Studente> gruppoStudenti = new ArrayList<>(entry.getValue());

			while (gruppoStudenti.size() >= 3) {
				List<Studente> corsoStudenti = new ArrayList<>(gruppoStudenti.subList(0, Math.min(gruppoStudenti.size(), 9)));
				gruppoStudenti.removeAll(corsoStudenti);

				Corso corso = new Corso();
				corso.setLingua(entry.getKey().split("-")[0]);
				corso.setTipoCorso("GRUPPO");
				corso.setFrequenza("1 volta a settimana");
				corso.setGiorno("Lunedì");
				corso.setOrario("16:00-18:00");
				corso.setStudenti(corsoStudenti);

				Optional<Aula> aulaDisponibile = aulaRepository.findAuleDisponibiliByGiornoEOrario("Lunedì", "16:00-18:00").stream().findFirst();
				aulaDisponibile.ifPresent(corso::setAula);

				corsoRepository.save(corso);
			}
		}
	}

	// ✅ Conversione Entity → DTO
	private CorsoResponseDTO convertToResponseDTO(Corso corso) {
		CorsoResponseDTO dto = new CorsoResponseDTO();
		BeanUtils.copyProperties(corso, dto);
		return dto;
	}
}
