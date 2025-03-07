package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.CorsoRequestDTO;
import it.Nkkz.gestione.scuola.dto.CorsoResponseDTO;
import it.Nkkz.gestione.scuola.entity.Aula;
import it.Nkkz.gestione.scuola.entity.Corso;
import it.Nkkz.gestione.scuola.entity.Insegnante;
import it.Nkkz.gestione.scuola.entity.Studente;
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

	// Recupera tutti i corsi attivi (Admin)
	public List<CorsoResponseDTO> getTuttiICorsi() {
		return corsoRepository.findByAttivoTrue().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// Recupera i corsi di un insegnante
	public List<CorsoResponseDTO> getCorsiByInsegnante(Long insegnanteId) {
		return corsoRepository.findByInsegnanteIdAndAttivoTrue(insegnanteId).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// Recupera corsi per giorno e orario
	public List<CorsoResponseDTO> getCorsiByGiornoEOrario(String giorno, String orario) {
		return corsoRepository.findByGiornoAndOrarioAndAttivoTrue(giorno, orario).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// Recupera corsi per lingua e livello
	public List<CorsoResponseDTO> getCorsiByLinguaELivello(String lingua, String livello) {
		return corsoRepository.findByLinguaAndLivelloAndAttivoTrue(lingua, livello).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// Recupera corsi per tipologia (privati o di gruppo)
	public List<CorsoResponseDTO> getCorsiByTipologia(String tipoCorso) {
		return corsoRepository.findByTipoCorsoAndAttivoTrue(tipoCorso).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// Crea un nuovo corso
	public CorsoResponseDTO creaCorso(CorsoRequestDTO request) {
		Corso corso = new Corso();
		BeanUtils.copyProperties(request, corso);
		corso.setStudenti(studenteRepository.findAllById(request.getStudentiIds()));
		corso.setAttivo(true);

		Optional<Aula> aulaDisponibile = aulaRepository.findById(request.getAulaId());
		aulaDisponibile.ifPresent(corso::setAula);

		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}

	// Modifica un corso esistente
	public CorsoResponseDTO modificaCorso(Long id, CorsoRequestDTO request) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		BeanUtils.copyProperties(request, corso, "id");
		corso.setStudenti(studenteRepository.findAllById(request.getStudentiIds()));

		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}

	// Interrompi un corso (senza eliminarlo)
	public void interrompiCorso(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		corso.setAttivo(false);
		corsoRepository.save(corso);
	}

	// Elimina definitivamente un corso
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

	// Gestione corsi pieni
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

	// Dividere un corso in due gruppi più piccoli
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

	// Aggiungere un posto extra al corso pieno
	private void aggiungiPostoExtra(Corso corso) {
		System.out.println("Posto extra aggiunto al corso " + corso.getLingua());
	}

	public void generaCorsiAutomaticamente() {
		List<Studente> studenti = studenteRepository.findAll();

		// Escludi gli studenti già assegnati a un corso
		List<Studente> studentiDisponibili = studenti.stream()
			.filter(s -> s.getCorsi() == null || s.getCorsi().isEmpty())
			.collect(Collectors.toList());

		// Raggruppa gli studenti per lingua, livello ed età massima di 2 anni
		Map<String, List<Studente>> gruppi = studentiDisponibili.stream()
			.filter(s -> s.getGiorniPreferiti() != null && s.getFasceOrariePreferite() != null)
			.collect(Collectors.groupingBy(s -> s.getLinguaDaImparare() + "-" + s.getLivello()));

		for (Map.Entry<String, List<Studente>> entry : gruppi.entrySet()) {
			List<Studente> gruppoStudenti = new ArrayList<>(entry.getValue());

			while (gruppoStudenti.size() >= 3) {
				// **Ordina gli studenti per età per garantire una differenza massima di 2 anni**
				gruppoStudenti.sort(Comparator.comparingInt(Studente::getEta));

				List<Studente> corsoStudenti = new ArrayList<>();
				Studente primoStudente = gruppoStudenti.get(0); // Studente più giovane come riferimento

				for (Studente studente : new ArrayList<>(gruppoStudenti)) {
					if (Math.abs(studente.getEta() - primoStudente.getEta()) <= 2) {
						corsoStudenti.add(studente);
					}
					if (corsoStudenti.size() == 9) break; // Massimo 9 studenti per corso
				}

				// Rimuove gli studenti assegnati dal gruppo principale
				gruppoStudenti.removeAll(corsoStudenti);

				// **Determina la frequenza più richiesta**
				Map<String, Long> frequenzePreferite = corsoStudenti.stream()
					.collect(Collectors.groupingBy(Studente::getTipoCorsoGruppo, Collectors.counting()));

				String frequenzaSelezionata = frequenzePreferite.entrySet().stream()
					.max(Map.Entry.comparingByValue())
					.map(Map.Entry::getKey)
					.orElse("1 volta a settimana");

				// **Trova il giorno e l'orario più comuni tra gli studenti**
				Map<String, Long> giorniFrequenza = corsoStudenti.stream()
					.flatMap(s -> s.getGiorniPreferiti().stream())
					.collect(Collectors.groupingBy(g -> g, Collectors.counting()));

				Map<String, Long> orariFrequenza = corsoStudenti.stream()
					.flatMap(s -> s.getFasceOrariePreferite().stream())
					.collect(Collectors.groupingBy(o -> o, Collectors.counting()));

				String giornoSelezionato = giorniFrequenza.entrySet().stream()
					.max(Map.Entry.comparingByValue())
					.map(Map.Entry::getKey)
					.orElse("Lunedì");

				String orarioSelezionato = orariFrequenza.entrySet().stream()
					.max(Map.Entry.comparingByValue())
					.map(Map.Entry::getKey)
					.orElse("16:00-18:00");

				// **Trova un insegnante disponibile che rispetti le preferenze**
				Optional<Insegnante> insegnanteDisponibile = insegnanteRepository.findAll().stream()
					.filter(i -> corsoStudenti.stream().allMatch(s -> s.getInsegnante() == null || s.getInsegnante().equals(i)))
					.filter(i -> i.getGiorniDisponibili().contains(giornoSelezionato))
					.filter(i -> i.getFasceOrarieDisponibili().contains(orarioSelezionato))
					.findFirst();

				if (insegnanteDisponibile.isEmpty()) {
					System.out.println("⚠️ Nessun insegnante disponibile per il gruppo " + entry.getKey());
					continue;
				}

				// **Trova un'aula disponibile per il corso**
				Optional<Aula> aulaDisponibile = aulaRepository.findAll().stream()
					.filter(aula -> aula.getCapienzaMax() >= corsoStudenti.size())
					.filter(aula -> aula.getDisponibilita().containsKey(giornoSelezionato))
					.filter(aula -> aula.getDisponibilita().get(giornoSelezionato).contains(orarioSelezionato))
					.findFirst();

				if (aulaDisponibile.isEmpty()) {
					System.out.println("⚠️ Nessuna aula disponibile per il gruppo " + entry.getKey());
					continue;
				}

				// **Crea il corso con i parametri selezionati**
				Corso corso = new Corso();
				corso.setLingua(entry.getKey().split("-")[0]);
				corso.setLivello(entry.getKey().split("-")[1]);
				corso.setTipoCorso("GRUPPO");
				corso.setFrequenza(frequenzaSelezionata);
				corso.setGiorno(giornoSelezionato);
				corso.setOrario(orarioSelezionato);
				corso.setStudenti(corsoStudenti);
				corso.setInsegnante(insegnanteDisponibile.get());
				corso.setAula(aulaDisponibile.get());
				corso.setAttivo(true);

				corsoRepository.save(corso);
			}
		}
	}


	// Elimina un corso in modo definitivo
	public void eliminaCorsoDefinitivamente(Long corsoId) {
		Corso corso = corsoRepository.findById(corsoId)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato con ID: " + corsoId));

		// Rimuove il corso dagli studenti
		corso.getStudenti().forEach(studente -> studente.getCorsi().remove(corso));

		// Se il corso ha un'aula assegnata, rimuove il riferimento
		if (corso.getAula() != null) {
			corso.setAula(null);
		}

		// Elimina il corso dal repository
		corsoRepository.delete(corso);
	}
	
	// Conversione Entity → DTO
	private CorsoResponseDTO convertToResponseDTO(Corso corso) {
		CorsoResponseDTO dto = new CorsoResponseDTO();
		BeanUtils.copyProperties(corso, dto);
		return dto;
	}
}
