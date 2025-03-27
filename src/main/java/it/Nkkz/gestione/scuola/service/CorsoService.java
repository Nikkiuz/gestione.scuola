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

<<<<<<< Updated upstream
	// ✅ Recupera tutti i corsi attivi (Admin)
=======
	@Autowired
	private InsegnanteRepository insegnanteRepository;

	private Map<Long, List<Studente>> listaDiAttesa = new HashMap<>();

	//Recupera tutti i corsi attivi (Admin)
>>>>>>> Stashed changes
	public List<CorsoResponseDTO> getTuttiICorsi() {
		return corsoRepository.findByAttivoTrue().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	//Recupera i corsi di un insegnante
	public List<CorsoResponseDTO> getCorsiByInsegnante(Long insegnanteId) {
		return corsoRepository.findByInsegnanteIdAndAttivoTrue(insegnanteId).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

<<<<<<< Updated upstream
	// ✅ Recupera corsi per giorno e orario
=======
	public CorsoResponseDTO getCorsoById(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato con ID: " + id));
		return convertToResponseDTO(corso);
	}


	//Recupera corsi per giorno e orario
>>>>>>> Stashed changes
	public List<CorsoResponseDTO> getCorsiByGiornoEOrario(String giorno, String orario) {
		return corsoRepository.findByGiornoAndOrarioAndAttivoTrue(giorno, orario).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

<<<<<<< Updated upstream
	// ✅ Recupera corsi per lingua e livello
	public List<CorsoResponseDTO> getCorsiByLinguaELivello(String lingua, String livello) {
=======
	//Recupera corsi per lingua e livello (ORA SENZA STRINGHE)
	public List<CorsoResponseDTO> getCorsiByLinguaELivello(String lingua, Livello livello) {
>>>>>>> Stashed changes
		return corsoRepository.findByLinguaAndLivelloAndAttivoTrue(lingua, livello).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	//Recupera corsi per tipologia (privati o di gruppo)
	public List<CorsoResponseDTO> getCorsiByTipologia(String tipoCorso) {
		return corsoRepository.findByTipoCorsoAndAttivoTrue(tipoCorso).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	//Crea un nuovo corso
	public CorsoResponseDTO creaCorso(CorsoRequestDTO request) {
<<<<<<< Updated upstream
=======
		Optional<Aula> aulaOpt = aulaRepository.findById(request.getAulaId());
		if (aulaOpt.isEmpty()) {
			throw new EntityNotFoundException("Aula non trovata con ID: " + request.getAulaId());
		}

		Aula aula = aulaOpt.get();

		// Controlla se l'aula è già occupata per giorno e orario
		List<Corso> corsiEsistenti = corsoRepository.findByAulaIdAndGiornoAndOrarioAndAttivoTrue(
			aula.getId(), request.getGiorno(), request.getOrario());

		if (!corsiEsistenti.isEmpty()) {
			throw new IllegalStateException("L'aula è già occupata per il giorno " + request.getGiorno() +
				" alle " + request.getOrario());
		}

>>>>>>> Stashed changes
		Corso corso = new Corso();
		BeanUtils.copyProperties(request, corso);
		corso.setStudenti(studenteRepository.findAllById(request.getStudentiIds()));
		corso.setAttivo(true);

		Optional<Aula> aulaDisponibile = aulaRepository.findById(request.getAulaId());
		aulaDisponibile.ifPresent(corso::setAula);

		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}

<<<<<<< Updated upstream
	// ✅ Modifica un corso esistente
=======

	//Modifica un corso esistente
>>>>>>> Stashed changes
	public CorsoResponseDTO modificaCorso(Long id, CorsoRequestDTO request) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

<<<<<<< Updated upstream
=======
		Optional<Aula> aulaOpt = aulaRepository.findById(request.getAulaId());
		if (aulaOpt.isEmpty()) {
			throw new EntityNotFoundException("Aula non trovata con ID: " + request.getAulaId());
		}
		Aula aula = aulaOpt.get();

		// Controlla che non ci siano altri corsi nella stessa aula, giorno e orario
		List<Corso> corsiEsistenti = corsoRepository.findByAulaIdAndGiornoAndOrarioAndAttivoTrue(
			aula.getId(), request.getGiorno(), request.getOrario());

		boolean sovrapposto = corsiEsistenti.stream()
			.anyMatch(c -> !c.getId().equals(corso.getId())); // Ignora se stesso

		if (sovrapposto) {
			throw new IllegalStateException("Impossibile modificare: l'aula è già occupata per quel giorno/orario.");
		}

>>>>>>> Stashed changes
		BeanUtils.copyProperties(request, corso, "id");
		corso.setStudenti(studenteRepository.findAllById(request.getStudentiIds()));

		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}

<<<<<<< Updated upstream
	// ✅ **Interrompi un corso** (senza eliminarlo)
=======

	//Interrompi un corso (senza eliminarlo)
>>>>>>> Stashed changes
	public void interrompiCorso(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		corso.setAttivo(false);
		corsoRepository.save(corso);
	}

<<<<<<< Updated upstream
	// ✅ **Elimina definitivamente un corso**
=======
	//Elimina definitivamente un corso
>>>>>>> Stashed changes
	public void eliminaCorso(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		// Libera gli orari e l'aula del corso eliminato
		if (corso.getAula() != null) {
			corso.getAula().getDisponibilita().remove(corso.getGiorno());
			aulaRepository.save(corso.getAula());
		}

		corsoRepository.deleteById(id);
	}

<<<<<<< Updated upstream
	// ✅ **Gestione corsi pieni**
=======
	//Gestione corsi pieni
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
	// ✅ **Dividere un corso in due gruppi più piccoli**
=======
	//Dividere un corso in due gruppi più piccoli
>>>>>>> Stashed changes
	private void dividiCorso(Corso corso) {
		List<Studente> studenti = new ArrayList<>(corso.getStudenti());

		if (studenti.size() < 2) {
			throw new IllegalArgumentException("Impossibile dividere un corso con meno di 2 studenti.");
		}

		int numeroStudentiPrimoGruppo = studenti.size() / 2;

		List<Studente> primoGruppo = new ArrayList<>(studenti.subList(0, numeroStudentiPrimoGruppo));
		List<Studente> secondoGruppo = new ArrayList<>(studenti.subList(numeroStudentiPrimoGruppo, studenti.size()));

		Corso corso1 = new Corso();
		corso1.setLingua(corso.getLingua());
		corso1.setTipoCorso(corso.getTipoCorso());
		corso1.setFrequenza(corso.getFrequenza());
		corso1.setGiorno(corso.getGiorno());
		corso1.setOrario(corso.getOrario());
		corso1.setLivello(corso.getLivello());
		corso1.setInsegnante(corso.getInsegnante());
		corso1.setStudenti(primoGruppo);
		corso1.setAttivo(true);

		Corso corso2 = new Corso();
		corso2.setLingua(corso.getLingua());
		corso2.setTipoCorso(corso.getTipoCorso());
		corso2.setFrequenza(corso.getFrequenza());
		corso2.setGiorno(corso.getGiorno());
		corso2.setOrario(corso.getOrario());
		corso2.setLivello(corso.getLivello());
		corso2.setInsegnante(corso.getInsegnante());
		corso2.setStudenti(secondoGruppo);
		corso2.setAttivo(true);

		corsoRepository.save(corso1);
		corsoRepository.save(corso2);
	}

<<<<<<< Updated upstream
	// ✅ **Aggiungere un posto extra al corso pieno**
=======
	//Aggiungere un posto extra al corso pieno
>>>>>>> Stashed changes
	private void aggiungiPostoExtra(Corso corso) {
		System.out.println("Posto extra aggiunto al corso " + corso.getLingua());
	}

	// ✅ **Genera corsi automaticamente**
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
				corso.setAttivo(true);

				corsoRepository.save(corso);
			}
		}
	}

<<<<<<< Updated upstream
	// ✅ **Conversione Entity → DTO**
	private CorsoResponseDTO convertToResponseDTO(Corso corso) {
		CorsoResponseDTO dto = new CorsoResponseDTO();
		BeanUtils.copyProperties(corso, dto);
=======
	//Metodo per ottenere tutti i corsi non attivi
	public List<CorsoResponseDTO> getCorsiDisattivati() {
		List<Corso> corsi = corsoRepository.findByAttivoFalse();
		return corsi.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
	}

	//Metodo per riattivare un corso
	public void riattivaCorso(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato con ID: " + id));

		if (corso.isAttivo()) {
			throw new IllegalStateException("Il corso è già attivo.");
		}

		//Controllo per evitare sovrapposizioni nell'aula
		List<Corso> corsiEsistenti = corsoRepository.findByAulaIdAndGiornoAndOrarioAndAttivoTrue(
			corso.getAula().getId(), corso.getGiorno(), corso.getOrario());

		if (!corsiEsistenti.isEmpty()) {
			throw new IllegalStateException("Impossibile riattivare il corso: l'aula è già occupata in quel giorno/orario.");
		}

		corso.setAttivo(true);
		corsoRepository.save(corso);
	}


	//Metodo per ottenere la lista di attesa raggruppata per corso
	public List<List<String>> getGruppiListaDiAttesa() {
		return listaDiAttesa.values().stream()
			.map(gruppo -> gruppo.stream()
				.map(Studente::getNome)
				.collect(Collectors.toList()))
			.collect(Collectors.toList());
	}


	//Metodo per ottenere la lista di attesa raggruppata per corso fittizio (o criterio)
	public List<StudenteResponseDTO> getListaDiAttesa() {
		return listaDiAttesa.values().stream()
			.flatMap(List::stream)
			.map(studente -> {
				StudenteResponseDTO dto = new StudenteResponseDTO();
				BeanUtils.copyProperties(studente, dto);
				return dto;
			})
			.collect(Collectors.toList());
	}
	
	public void aggiungiStudente(Long corsoId, Long studenteId) {
		Corso corso = corsoRepository.findById(corsoId)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato con ID: " + corsoId));
		Studente studente = studenteRepository.findById(studenteId)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + studenteId));

		// Aggiungi lo studente alla lista
		List<Studente> studenti = corso.getStudenti();
		if (!studenti.contains(studente)) {
			studenti.add(studente);
			corsoRepository.save(corso);
		} else {
			throw new IllegalArgumentException("Lo studente è già assegnato a questo corso.");
		}
	}


	//Metodo per convertire un Corso in CorsoResponseDTO
	public CorsoResponseDTO convertToResponseDTO(Corso corso) {
		CorsoResponseDTO dto = new CorsoResponseDTO();
		BeanUtils.copyProperties(corso, dto);


		// Aggiungi il campo "attivo"
		dto.setAttivo(corso.isAttivo());
		dto.setSecondoGiorno(corso.getSecondoGiorno());
		dto.setSecondoOrario(corso.getSecondoOrario());

		//Assegna manualmente l'insegnante
		if (corso.getInsegnante() != null) {
			InsegnanteResponseDTO insegnanteDTO = new InsegnanteResponseDTO();
			BeanUtils.copyProperties(corso.getInsegnante(), insegnanteDTO);
			dto.setInsegnante(insegnanteDTO);
		}

		//Assegna manualmente l'aula
		if (corso.getAula() != null) {
			AulaResponseDTO aulaDTO = new AulaResponseDTO();
			BeanUtils.copyProperties(corso.getAula(), aulaDTO);
			dto.setAula(aulaDTO);
		}

		//Mappa gli studenti in StudenteResponseDTO
		if (corso.getStudenti() != null && !corso.getStudenti().isEmpty()) {
			List<StudenteResponseDTO> studentiDTO = corso.getStudenti().stream().map(studente -> {
				StudenteResponseDTO sDTO = new StudenteResponseDTO();
				BeanUtils.copyProperties(studente, sDTO);
				return sDTO;
			}).collect(Collectors.toList());
			dto.setStudenti(studentiDTO);
		}

>>>>>>> Stashed changes
		return dto;
	}
}
