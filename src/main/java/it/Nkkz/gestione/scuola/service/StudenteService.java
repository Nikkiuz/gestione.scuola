package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.entity.Studente;
import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudenteService {

	@Autowired
	private StudenteRepository studenteRepository;

	// ✅ Recupera tutti gli studenti
	public List<Studente> getAllStudenti() {
		return studenteRepository.findAll();
	}

	// ✅ Recupera uno studente per ID
	public Studente getStudenteById(Long id) {
		return studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + id));
	}

	// ✅ Crea un nuovo studente
	public Studente createStudente(Studente studente) {
		return studenteRepository.save(studente);
	}

	// ✅ Recupera studenti per lingua
	public List<Studente> getStudentiByLingua(String lingua) {
		return studenteRepository.findAll().stream()
			.filter(studente -> lingua.equalsIgnoreCase(studente.getLinguaDaImparare()))
			.collect(Collectors.toList());
	}

	// ✅ Recupera studenti assegnati a un determinato insegnante
	public List<Studente> getStudentiByInsegnante(Long insegnanteId) {
		return studenteRepository.findAll().stream()
			.filter(studente -> studente.getInsegnante() != null && studente.getInsegnante().getId().equals(insegnanteId))
			.collect(Collectors.toList());
	}

	// ✅ Aggiorna uno studente esistente (usiamo `BeanUtils`)
	public Studente updateStudente(Long id, Studente studenteDetails) {
		Studente studente = getStudenteById(id);
		BeanUtils.copyProperties(studenteDetails, studente, "id");
		return studenteRepository.save(studente);
	}

	// ✅ Elimina uno studente (solo l'Admin può farlo)
	public void deleteStudente(Long id) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		if (!auth.getAuthorities().toString().contains("ROLE_ADMIN")) {
			throw new AccessDeniedException("Solo l'Admin può eliminare uno studente.");
		}

		Studente studente = getStudenteById(id);
		studenteRepository.delete(studente);
	}
}
