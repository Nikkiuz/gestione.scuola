package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.CorsoRequestDTO;
import it.Nkkz.gestione.scuola.dto.CorsoResponseDTO;
import it.Nkkz.gestione.scuola.entity.Corso;
import it.Nkkz.gestione.scuola.entity.Studente;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import it.Nkkz.gestione.scuola.repository.AulaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CorsoService {

	private final CorsoRepository corsoRepository;
	private final StudenteRepository studenteRepository;
	private final AulaRepository aulaRepository;

	public CorsoService(CorsoRepository corsoRepository, StudenteRepository studenteRepository, AulaRepository aulaRepository) {
		this.corsoRepository = corsoRepository;
		this.studenteRepository = studenteRepository;
		this.aulaRepository = aulaRepository;
	}

	// ✅ Recupera tutti i corsi
	public List<CorsoResponseDTO> getAllCorsi() {
		return corsoRepository.findAll().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera un corso per ID
	public CorsoResponseDTO getCorsoById(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato con ID: " + id));
		return convertToResponseDTO(corso);
	}

	// ✅ Crea un corso
	public CorsoResponseDTO createCorso(CorsoRequestDTO corsoRequestDTO) {
		Corso corso = new Corso();
		BeanUtils.copyProperties(corsoRequestDTO, corso);
		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}

	// ✅ Modifica un corso
	public CorsoResponseDTO updateCorso(Long id, CorsoRequestDTO corsoRequestDTO) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato con ID: " + id));
		BeanUtils.copyProperties(corsoRequestDTO, corso);
		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}

	// ✅ Elimina un corso
	public void deleteCorso(Long id) {
		corsoRepository.deleteById(id);
	}

	// ✅ Genera corsi automaticamente basati sugli studenti
	public void generaCorsiAutomaticamente() {
		// Implementazione logica per la creazione automatica
	}

	// ✅ Gestione corso pieno (dividere il corso o aggiungere posti)
	public void gestisciCorsoPieno(Long id, int opzione) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato con ID: " + id));

		if (opzione == 1) {
			dividiCorso(corso);
		} else if (opzione == 2) {
			aggiungiPostoExtra(corso);
		} else {
			throw new IllegalArgumentException("Opzione non valida.");
		}
	}

	// ✅ Divide un corso pieno in due gruppi
	private void dividiCorso(Corso corso) {
		List<Studente> studenti = new ArrayList<>(corso.getStudenti());
		List<Studente> gruppo1 = studenti.subList(0, studenti.size() / 2);
		List<Studente> gruppo2 = studenti.subList(studenti.size() / 2, studenti.size());

		Corso corso1 = new Corso();
		Corso corso2 = new Corso();
		BeanUtils.copyProperties(corso, corso1);
		BeanUtils.copyProperties(corso, corso2);

		corso1.setStudenti(gruppo1);
		corso2.setStudenti(gruppo2);

		corsoRepository.save(corso1);
		corsoRepository.save(corso2);
	}

	// ✅ Aggiunge un posto extra al corso
	private void aggiungiPostoExtra(Corso corso) {
		// Logica per aggiungere un posto extra
	}

	// ✅ Converte un corso in DTO
	private CorsoResponseDTO convertToResponseDTO(Corso corso) {
		CorsoResponseDTO dto = new CorsoResponseDTO();
		BeanUtils.copyProperties(corso, dto);
		return dto;
	}
}
