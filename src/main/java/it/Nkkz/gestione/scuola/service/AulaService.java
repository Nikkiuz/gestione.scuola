package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.AulaRequestDTO;
import it.Nkkz.gestione.scuola.dto.AulaResponseDTO;
import it.Nkkz.gestione.scuola.entity.Aula;
import it.Nkkz.gestione.scuola.repository.AulaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AulaService {

	private final AulaRepository aulaRepository;

	public AulaService(AulaRepository aulaRepository) {
		this.aulaRepository = aulaRepository;
	}

	// ✅ Recupera tutte le aule
	public List<AulaResponseDTO> getAllAule() {
		return aulaRepository.findAll().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera un'aula per ID
	public AulaResponseDTO getAulaById(Long id) {
		Aula aula = aulaRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Aula non trovata con ID: " + id));
		return convertToResponseDTO(aula);
	}

	// ✅ Crea un'aula
	public AulaResponseDTO createAula(AulaRequestDTO aulaRequestDTO) {
		Aula aula = new Aula();
		BeanUtils.copyProperties(aulaRequestDTO, aula);
		aulaRepository.save(aula);
		return convertToResponseDTO(aula);
	}

	// ✅ Modifica un'aula
	public AulaResponseDTO updateAula(Long id, AulaRequestDTO aulaRequestDTO) {
		Aula aula = aulaRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Aula non trovata con ID: " + id));
		BeanUtils.copyProperties(aulaRequestDTO, aula);
		aulaRepository.save(aula);
		return convertToResponseDTO(aula);
	}

	// ✅ Elimina un'aula
	public void deleteAula(Long id) {
		aulaRepository.deleteById(id);
	}

	// ✅ Recupera le aule disponibili per un giorno e orario specifici
	public List<AulaResponseDTO> getAuleDisponibiliByGiornoEOrario(String giorno, String orario) {
		return aulaRepository.findAuleDisponibiliByGiornoEOrario(giorno, orario).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Converte un'aula in DTO
	private AulaResponseDTO convertToResponseDTO(Aula aula) {
		AulaResponseDTO dto = new AulaResponseDTO();
		BeanUtils.copyProperties(aula, dto);
		return dto;
	}
}
