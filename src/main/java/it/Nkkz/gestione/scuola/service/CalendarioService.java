package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.CalendarioDTO;
import it.Nkkz.gestione.scuola.entity.Aula;
import it.Nkkz.gestione.scuola.entity.Corso;
import it.Nkkz.gestione.scuola.repository.AulaRepository;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CalendarioService {

	@Autowired
	private CorsoRepository corsoRepository;

	@Autowired
	private AulaRepository aulaRepository;

	// 🔹 Recupera le aule disponibili in un giorno e orario specifico
	public List<String> getAuleDisponibili(String giorno, String orario) {
		List<Long> auleOccupate = corsoRepository.findByGiornoAndOrarioAndAttivoTrue(giorno, orario)
			.stream()
			.map(c -> c.getAula().getId())
			.collect(Collectors.toList());

		return aulaRepository.findAll().stream()
			.filter(aula -> !auleOccupate.contains(aula.getId()))
			.map(Aula::getNome)
			.collect(Collectors.toList());
	}

	// 🔹 Interrompe un corso (senza eliminarlo) e libera l'orario dell'aula
	public void interrompiCorso(Long corsoId) {
		Corso corso = corsoRepository.findById(corsoId)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		corso.setAttivo(false);
		corsoRepository.save(corso);
	}

	// ✅ Recupera i corsi programmati in un determinato giorno della settimana
	public List<CalendarioDTO> getCorsiSettimanaFiltrati(String giornoBase, Long insegnanteId, String livello) {
		List<String> giorniSettimana = List.of("Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato");

		return corsoRepository.findByAttivoTrue().stream()
			.filter(c -> giorniSettimana.contains(c.getGiorno()))
			.filter(c -> insegnanteId == null || c.getInsegnante().getId().equals(insegnanteId))
			.filter(c -> livello == null || livello.isEmpty() || c.getLivello().toString().equalsIgnoreCase(livello))
			.map(c -> new CalendarioDTO(
				c.getId(),
				c.getLingua(),
				c.getTipoCorso(),
				c.getFrequenza(),
				c.getGiorno(),
				c.getOrario(),
				c.getAula().getNome(),
				c.getInsegnante().getNome() + " " + c.getInsegnante().getCognome()
			))
			.collect(Collectors.toList());
	}



}
