package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.CalendarioDTO;
import it.Nkkz.gestione.scuola.entity.Aula;
import it.Nkkz.gestione.scuola.entity.Corso;
import it.Nkkz.gestione.scuola.repository.AulaRepository;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

	// ✅ Recupera i corsi programmati in un determinato giorno della settimana
	public List<CalendarioDTO> getCorsiProgrammati(String giorno) {
		return corsoRepository.findByGiornoAndAttivoTrue(giorno).stream()
			.map(corso -> new CalendarioDTO(
				corso.getId(),
				corso.getLingua(),
				corso.getTipoCorso(),
				corso.getFrequenza(),
				corso.getGiorno(),
				corso.getOrario(),
				corso.getAula().getNome(),
				corso.getInsegnante().getNome() + " " + corso.getInsegnante().getCognome()
			))
			.collect(Collectors.toList());
	}

	// 🔹 Interrompe un corso (senza eliminarlo) e libera l'orario dell'aula
	public void interrompiCorso(Long corsoId) {
		Corso corso = corsoRepository.findById(corsoId)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		corso.setAttivo(false);
		corsoRepository.save(corso);
	}
}
