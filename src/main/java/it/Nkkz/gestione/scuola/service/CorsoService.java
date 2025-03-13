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

	// ✅ Recupera tutti i corsi attivi (Admin)
	public List<CorsoResponseDTO> getTuttiICorsi() {
		return corsoRepository.findByAttivoTrue().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	public List<CorsoResponseDTO> getCorsiByGiornoEOrario(String giorno, String orario) {
		return corsoRepository.findAll().stream()
			.filter(corso -> corso.getGiorno().equals(giorno) && corso.getOrario().equals(orario)
				|| (corso.getSecondoGiorno() != null && corso.getSecondoGiorno().equals(giorno)
				&& corso.getSecondoOrario().equals(orario)))
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}


	// ✅ Recupera i corsi di un insegnante
	public List<CorsoResponseDTO> getCorsiByInsegnante(Long insegnanteId) {
		return corsoRepository.findByInsegnanteIdAndAttivoTrue(insegnanteId).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera corsi per lingua e livello
	public List<CorsoResponseDTO> getCorsiByLinguaELivello(String lingua, String livello) {
		return corsoRepository.findByLinguaAndLivelloAndAttivoTrue(lingua, livello).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera corsi per tipologia (GRUPPO o PRIVATO)
	public List<CorsoResponseDTO> getCorsiByTipologia(String tipoCorso) {
		return corsoRepository.findByTipoCorsoAndAttivoTrue(tipoCorso).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Gestisce un corso pieno (Admin decide se dividere il corso o aggiungere un posto extra)
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

	// 🔹 Divide un corso in due gruppi più piccoli
	private void dividiCorso(Corso corso) {
		List<Studente> studenti = new ArrayList<>(corso.getStudenti());

		if (studenti.size() < 2) {
			throw new IllegalArgumentException("Impossibile dividere un corso con meno di 2 studenti.");
		}

		int numeroStudentiPrimoGruppo = studenti.size() / 2;

		List<Studente> primoGruppo = new ArrayList<>(studenti.subList(0, numeroStudentiPrimoGruppo));
		List<Studente> secondoGruppo = new ArrayList<>(studenti.subList(numeroStudentiPrimoGruppo, studenti.size()));

		Corso corso1 = new Corso();
		BeanUtils.copyProperties(corso, corso1, "id", "studenti");
		corso1.setStudenti(primoGruppo);
		corsoRepository.save(corso1);

		Corso corso2 = new Corso();
		BeanUtils.copyProperties(corso, corso2, "id", "studenti");
		corso2.setStudenti(secondoGruppo);
		corsoRepository.save(corso2);
	}

	// 🔹 Aggiunge un posto extra al corso pieno
	private void aggiungiPostoExtra(Corso corso) {
		System.out.println("Posto extra aggiunto al corso " + corso.getLingua());
	}

	// ✅ Crea un nuovo corso
	public CorsoResponseDTO creaCorso(CorsoRequestDTO request) {
		Corso corso = new Corso();
		BeanUtils.copyProperties(request, corso);
		corso.setAttivo(true);

		// 🛠️ Recupero insegnante e verifica disponibilità
		Insegnante insegnante = insegnanteRepository.findById(request.getInsegnanteId())
			.orElseThrow(() -> new EntityNotFoundException("Insegnante non trovato"));

		if (!insegnante.getGiorniDisponibili().contains(request.getGiorno())) {
			throw new IllegalArgumentException("L'insegnante non è disponibile il giorno " + request.getGiorno());
		}

		if (!insegnante.getFasceOrarieDisponibili().contains(request.getOrario())) {
			throw new IllegalArgumentException("L'insegnante non è disponibile nell'orario " + request.getOrario());
		}

		corso.setInsegnante(insegnante);

		// 🏫 Recupero aula e verifica capienza/disponibilità
		Aula aula = aulaRepository.findById(request.getAulaId())
			.orElseThrow(() -> new EntityNotFoundException("Aula non trovata"));

		List<Studente> studenti = studenteRepository.findAllById(request.getStudentiIds());

		if (studenti.size() > aula.getCapienzaMax()) {
			throw new IllegalArgumentException("L'aula selezionata può contenere solo " + aula.getCapienzaMax() + " studenti");
		}

		// ⚠️ Controlla se l'aula è disponibile per il giorno/orario richiesto
		List<Corso> corsiNellAula = corsoRepository.findByGiornoAndOrarioAndAttivoTrue(request.getGiorno(), request.getOrario());
		for (Corso c : corsiNellAula) {
			if (c.getAula().getId().equals(aula.getId())) {
				throw new IllegalArgumentException("L'aula è già occupata in questo orario.");
			}
		}

		corso.setAula(aula);
		corso.setStudenti(studenti);

		// 📅 Se il corso è **da due volte a settimana**, verifica il secondo giorno
		if ("2 volte a settimana".equals(request.getFrequenza())) {
			if (request.getSecondoGiorno() == null || request.getSecondoOrario() == null) {
				throw new IllegalArgumentException("Per un corso da due volte a settimana è necessario specificare il secondo giorno e orario.");
			}

			if (!insegnante.getGiorniDisponibili().contains(request.getSecondoGiorno())) {
				throw new IllegalArgumentException("L'insegnante non è disponibile il secondo giorno " + request.getSecondoGiorno());
			}

			if (!insegnante.getFasceOrarieDisponibili().contains(request.getSecondoOrario())) {
				throw new IllegalArgumentException("L'insegnante non è disponibile nel secondo orario " + request.getSecondoOrario());
			}

			List<Corso> corsiNellAulaSecondoGiorno = corsoRepository.findByGiornoAndOrarioAndAttivoTrue(request.getSecondoGiorno(), request.getSecondoOrario());
			for (Corso c : corsiNellAulaSecondoGiorno) {
				if (c.getAula().getId().equals(aula.getId())) {
					throw new IllegalArgumentException("L'aula è già occupata nel secondo giorno/orario selezionato.");
				}
			}

			corso.setSecondoGiorno(request.getSecondoGiorno());
			corso.setSecondoOrario(request.getSecondoOrario());
		}

		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}


	// ✅ Modifica un corso
	public CorsoResponseDTO modificaCorso(Long id, CorsoRequestDTO request) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		// ✅ Controllo Disponibilità Insegnante
		Insegnante insegnante = insegnanteRepository.findById(request.getInsegnanteId())
			.orElseThrow(() -> new EntityNotFoundException("Insegnante non trovato"));

		if (!insegnante.getGiorniDisponibili().contains(request.getGiorno())) {
			throw new IllegalArgumentException("L'insegnante non è disponibile il giorno " + request.getGiorno());
		}

		if (!insegnante.getFasceOrarieDisponibili().contains(request.getOrario())) {
			throw new IllegalArgumentException("L'insegnante non è disponibile nell'orario " + request.getOrario());
		}

		corso.setInsegnante(insegnante);

		// ✅ Controllo Disponibilità Aula
		Aula aula = aulaRepository.findById(request.getAulaId())
			.orElseThrow(() -> new EntityNotFoundException("Aula non trovata"));

		List<Studente> studenti = studenteRepository.findAllById(request.getStudentiIds());

		if (studenti.size() > aula.getCapienzaMax()) {
			throw new IllegalArgumentException("L'aula selezionata può contenere solo " + aula.getCapienzaMax() + " studenti");
		}

		// ⚠️ Controlla se l'aula è disponibile per il giorno/orario richiesto
		List<Corso> corsiNellAula = corsoRepository.findByGiornoAndOrarioAndAttivoTrue(request.getGiorno(), request.getOrario());
		for (Corso c : corsiNellAula) {
			if (!c.getId().equals(id) && c.getAula().getId().equals(aula.getId())) {
				throw new IllegalArgumentException("L'aula è già occupata in questo orario.");
			}
		}

		corso.setAula(aula);
		corso.setStudenti(studenti);
		corso.setGiorno(request.getGiorno());
		corso.setOrario(request.getOrario());
		corso.setFrequenza(request.getFrequenza());

		// ✅ Controllo per Corsi "2 volte a settimana"
		if ("2 volte a settimana".equals(request.getFrequenza())) {
			if (request.getSecondoGiorno() == null || request.getSecondoOrario() == null) {
				throw new IllegalArgumentException("Per un corso da due volte a settimana è necessario specificare il secondo giorno e orario.");
			}

			if (!insegnante.getGiorniDisponibili().contains(request.getSecondoGiorno())) {
				throw new IllegalArgumentException("L'insegnante non è disponibile il secondo giorno " + request.getSecondoGiorno());
			}

			if (!insegnante.getFasceOrarieDisponibili().contains(request.getSecondoOrario())) {
				throw new IllegalArgumentException("L'insegnante non è disponibile nel secondo orario " + request.getSecondoOrario());
			}

			List<Corso> corsiNellAulaSecondoGiorno = corsoRepository.findByGiornoAndOrarioAndAttivoTrue(request.getSecondoGiorno(), request.getSecondoOrario());
			for (Corso c : corsiNellAulaSecondoGiorno) {
				if (!c.getId().equals(id) && c.getAula().getId().equals(aula.getId())) {
					throw new IllegalArgumentException("L'aula è già occupata nel secondo giorno/orario selezionato.");
				}
			}

			corso.setSecondoGiorno(request.getSecondoGiorno());
			corso.setSecondoOrario(request.getSecondoOrario());
		}

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

	// ✅ Elimina un corso definitivamente
	public void eliminaCorso(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));
		corso.getStudenti().forEach(studente -> studente.getCorsi().remove(corso));
		corsoRepository.deleteById(id);
	}

	// ✅ Genera corsi automaticamente tenendo conto della preferenza insegnante
	public String generaCorsiAutomaticamente() {
		List<Studente> studentiDisponibili = studenteRepository.findAll()
			.stream()
			.filter(s -> s.getCorsi().isEmpty())
			.collect(Collectors.toList());

		Map<String, List<Studente>> gruppi = studentiDisponibili.stream()
			.collect(Collectors.groupingBy(s -> s.getLinguaDaImparare() + "-" + s.getLivello()));

		int corsiCreati = 0;
		for (var entry : gruppi.entrySet()) {
			List<Studente> gruppoStudenti = new ArrayList<>(entry.getValue());

			while (!gruppoStudenti.isEmpty()) {
				// 📌 Ordiniamo gli studenti per età per rispettare il range di ±2 anni
				gruppoStudenti.sort(Comparator.comparingInt(Studente::getEta));

				List<Studente> corsoStudenti = new ArrayList<>();
				Studente riferimento = gruppoStudenti.get(0);

				for (Studente s : new ArrayList<>(gruppoStudenti)) {
					if (Math.abs(s.getEta() - riferimento.getEta()) <= 2) {
						corsoStudenti.add(s);
						if (corsoStudenti.size() == 9) break; // Max 9 studenti
					}
				}
				gruppoStudenti.removeAll(corsoStudenti);

				// 🎓 Determiniamo il giorno e l'orario più comuni
				List<String> giorniPreferiti = corsoStudenti.stream()
					.flatMap(s -> s.getGiorniPreferiti().stream())
					.collect(Collectors.toList());

				Map<String, Long> frequenzaGiorni = giorniPreferiti.stream()
					.collect(Collectors.groupingBy(g -> g, Collectors.counting()));

				// 📌 Determiniamo se il corso deve essere 1 o 2 volte a settimana
				String frequenzaCorso = corsoStudenti.stream()
					.collect(Collectors.groupingBy(Studente::getTipoCorsoGruppo, Collectors.counting()))
					.entrySet().stream()
					.max(Map.Entry.comparingByValue())
					.map(Map.Entry::getKey)
					.orElse("1 volta a settimana");

				// 📌 Se il corso è 2 volte a settimana, troviamo i due giorni più comuni
				List<String> giorniSelezionati = frequenzaGiorni.entrySet().stream()
					.sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
					.limit(frequenzaCorso.equals("2 volte a settimana") ? 2 : 1)
					.map(Map.Entry::getKey)
					.collect(Collectors.toList());

				// 🎯 Determiniamo gli orari più comuni
				String orarioSelezionato = corsoStudenti.stream()
					.flatMap(s -> s.getFasceOrariePreferite().stream())
					.collect(Collectors.groupingBy(o -> o, Collectors.counting()))
					.entrySet().stream()
					.max(Map.Entry.comparingByValue())
					.map(Map.Entry::getKey)
					.orElse("16:00-18:00");

				// 👨‍🏫 Troviamo un insegnante preferito disponibile
				Optional<Insegnante> insegnanteDisponibile = corsoStudenti.stream()
					.map(Studente::getInsegnante)
					.filter(Objects::nonNull)
					.distinct()
					.filter(i -> giorniSelezionati.stream().allMatch(i.getGiorniDisponibili()::contains))
					.filter(i -> i.getFasceOrarieDisponibili().contains(orarioSelezionato))
					.findFirst();

				// Se nessun insegnante preferito è disponibile, troviamone uno qualsiasi compatibile
				if (insegnanteDisponibile.isEmpty()) {
					insegnanteDisponibile = insegnanteRepository.findAll().stream()
						.filter(i -> giorniSelezionati.stream().allMatch(i.getGiorniDisponibili()::contains))
						.filter(i -> i.getFasceOrarieDisponibili().contains(orarioSelezionato))
						.findFirst();
				}

				if (insegnanteDisponibile.isEmpty()) {
					continue;
				}

				// 🏫 Troviamo un'aula disponibile per tutti i giorni
				Optional<Aula> aulaDisponibile = aulaRepository.findAll().stream()
					.filter(a -> a.getCapienzaMax() >= corsoStudenti.size())
					.findFirst();

				if (aulaDisponibile.isEmpty()) {
					continue;
				}

				// 📌 Creiamo il corso
				Corso corso = new Corso();
				corso.setLingua(entry.getKey().split("-")[0]);
				corso.setLivello(entry.getKey().split("-")[1]);
				corso.setTipoCorso("GRUPPO");
				corso.setFrequenza(frequenzaCorso);
				corso.setGiorno(String.join(", ", giorniSelezionati));
				corso.setOrario(orarioSelezionato);
				corso.setStudenti(corsoStudenti);
				corso.setInsegnante(insegnanteDisponibile.get());
				corso.setAula(aulaDisponibile.get());
				corso.setAttivo(true);

				corsoRepository.save(corso);
				corsiCreati++;
			}
		}
		return "✅ " + corsiCreati + " corsi generati con successo.";
	}

	// ✅ Converti Entity → DTO
	private CorsoResponseDTO convertToResponseDTO(Corso corso) {
		CorsoResponseDTO dto = new CorsoResponseDTO();
		BeanUtils.copyProperties(corso, dto);
		return dto;
	}
}
