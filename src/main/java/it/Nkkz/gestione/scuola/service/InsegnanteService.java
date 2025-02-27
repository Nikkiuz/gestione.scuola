package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.entity.Insegnante;
import it.Nkkz.gestione.scuola.repository.InsegnanteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InsegnanteService {

	@Autowired
	private InsegnanteRepository insegnanteRepository;

	// ✅ Recupera tutti gli insegnanti (Solo Admin)
	public List<Insegnante> getAllInsegnanti() {
		return insegnanteRepository.findAll();
	}

	// ✅ Recupera un insegnante per ID
	public Insegnante getInsegnanteById(Long id) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String loggedUsername = auth.getName();

		Insegnante insegnante = insegnanteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Insegnante non trovato con ID: " + id));

		// Se non è Admin e sta cercando un altro insegnante, blocchiamo l'accesso
		if (!insegnante.getUtente().getUsername().equals(loggedUsername) && !auth.getAuthorities().toString().contains("ROLE_ADMIN")) {
			throw new AccessDeniedException("Non puoi visualizzare le informazioni di un altro insegnante.");
		}

		return insegnante;
	}

	// ✅ Un insegnante può aggiornare tutti i suoi dati (Admin può modificare tutto)
	public Insegnante updateInsegnante(Long id, Insegnante insegnanteDetails) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String loggedUsername = auth.getName();

		Insegnante insegnante = getInsegnanteById(id);

		// Se non è Admin e sta cercando di modificare un altro insegnante, blocchiamo l'accesso
		if (!insegnante.getUtente().getUsername().equals(loggedUsername) && !auth.getAuthorities().toString().contains("ROLE_ADMIN")) {
			throw new AccessDeniedException("Non puoi modificare un altro insegnante.");
		}

		// ✅ Usa `BeanUtils` per aggiornare tutti i dati tranne `id` e `utente`
		BeanUtils.copyProperties(insegnanteDetails, insegnante, "id", "utente");

		return insegnanteRepository.save(insegnante);
	}

	// ✅ Elimina un insegnante (Solo Admin)
	public void deleteInsegnante(Long id) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		if (!auth.getAuthorities().toString().contains("ROLE_ADMIN")) {
			throw new AccessDeniedException("Solo l'Admin può eliminare un insegnante.");
		}

		Insegnante insegnante = getInsegnanteById(id);
		insegnanteRepository.delete(insegnante);
	}
}

