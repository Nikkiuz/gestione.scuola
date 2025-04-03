package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.CalendarioDTO;
import it.Nkkz.gestione.scuola.entity.Aula;
import it.Nkkz.gestione.scuola.entity.Corso;
import it.Nkkz.gestione.scuola.entity.Giorno;
import it.Nkkz.gestione.scuola.repository.AulaRepository;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CalendarioService {

	@Autowired
	private CorsoRepository corsoRepository;

	@Autowired
	private AulaRepository aulaRepository;

	//Recupera le aule disponibili in un giorno e orario specifico
	public List<String> getAuleDisponibili(Giorno giorno, String orario) {
		List<Long> auleOccupate = corsoRepository.findByGiornoAndOrarioAndAttivoTrue(giorno, orario)
			.stream()
			.map(c -> c.getAula().getId())
			.collect(Collectors.toList());

		return aulaRepository.findAll().stream()
			.filter(aula -> !auleOccupate.contains(aula.getId()))
			.map(Aula::getNome)
			.collect(Collectors.toList());
	}

	//Interrompe un corso (senza eliminarlo) e libera l'orario dell'aula
	public void interrompiCorso(Long corsoId) {
		Corso corso = corsoRepository.findById(corsoId)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		corso.setAttivo(false);
		corsoRepository.save(corso);
	}

	private boolean giornoMatch(String giornoBase, Giorno giornoEnum) {
		if (giornoBase == null || giornoBase.isBlank()
			|| giornoBase.equalsIgnoreCase("settimana")
			|| giornoBase.equalsIgnoreCase("tutti")) {
			return true;
		}
		try {
			return Giorno.valueOf(giornoBase.toUpperCase()).equals(giornoEnum);
		} catch (IllegalArgumentException e) {
			return false;
		}
	}


	// Recupera i corsi programmati in un determinato giorno della settimana
	public List<CalendarioDTO> getCorsiSettimanaFiltrati(String giornoBase, Long insegnanteId, String livello) {
		List<CalendarioDTO> lezioni = new ArrayList<>();

		List<Corso> corsi = corsoRepository.findByAttivoTrue().stream()
			.filter(c -> insegnanteId == null || (c.getInsegnante() != null && c.getInsegnante().getId().equals(insegnanteId)))
			.filter(c -> livello == null || livello.isEmpty() || c.getLivello().toString().equalsIgnoreCase(livello))
			.toList();

		for (Corso c : corsi) {
			String aulaNome = c.getAula() != null ? c.getAula().getNome() : "N/A";
			String insegnanteNome = c.getInsegnante() != null
				? c.getInsegnante().getNome() + " " + c.getInsegnante().getCognome()
				: "N/A";

			// ➕ Primo giorno
			if (giornoMatch(giornoBase, c.getGiorno())) {
				lezioni.add(new CalendarioDTO(
					c.getId(),
					c.getLingua(),
					c.getTipoCorso(),
					c.getFrequenza(),
					c.getGiorno().name(),
					c.getOrario(),
					aulaNome,
					insegnanteNome,
					c.getLivello().name()
				));
			}

			// ➕ Secondo giorno se esiste
			if ("2 volte a settimana".equalsIgnoreCase(c.getFrequenza())
				&& c.getSecondoGiorno() != null
				&& c.getSecondoOrario() != null
				&& giornoMatch(giornoBase, c.getSecondoGiorno())) {

				lezioni.add(new CalendarioDTO(
					c.getId(),
					c.getLingua(),
					c.getTipoCorso(),
					c.getFrequenza(),
					c.getSecondoGiorno().name(),
					c.getSecondoOrario(),
					aulaNome,
					insegnanteNome,
					c.getLivello().name()
				));
			}
		}

		return lezioni;
	}

}
