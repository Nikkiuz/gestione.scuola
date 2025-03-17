package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.InsegnanteRequestDTO;
import it.Nkkz.gestione.scuola.dto.InsegnanteResponseDTO;
import it.Nkkz.gestione.scuola.entity.Insegnante;
import it.Nkkz.gestione.scuola.repository.InsegnanteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InsegnanteService {

	@Autowired
	private InsegnanteRepository insegnanteRepository;

	// ✅ Recupera tutti gli insegnanti
	public List<InsegnanteResponseDTO> getAllInsegnanti() {
		return insegnanteRepository.findAll().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera un insegnante per ID
	public InsegnanteResponseDTO getInsegnanteById(Long id) {
		Insegnante insegnante = insegnanteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Insegnante non trovato con ID: " + id));
		return convertToResponseDTO(insegnante);
	}

	// ✅ Crea un nuovo insegnante
	public InsegnanteResponseDTO createInsegnante(InsegnanteRequestDTO insegnanteRequestDTO) {
		Insegnante insegnante = new Insegnante();
		BeanUtils.copyProperties(insegnanteRequestDTO, insegnante);
		insegnanteRepository.save(insegnante);
		return convertToResponseDTO(insegnante);
	}

	// ✅ Modifica un insegnante
	public InsegnanteResponseDTO updateInsegnante(Long id, InsegnanteRequestDTO insegnanteRequestDTO) {
		Insegnante insegnante = insegnanteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Insegnante non trovato con ID: " + id));
		BeanUtils.copyProperties(insegnanteRequestDTO, insegnante);
		insegnanteRepository.save(insegnante);
		return convertToResponseDTO(insegnante);
	}

	// ✅ Elimina un insegnante
	public void deleteInsegnante(Long id) {
		insegnanteRepository.deleteById(id);
	}

	// ✅ Converte un'entità Insegnante in DTO
	private InsegnanteResponseDTO convertToResponseDTO(Insegnante insegnante) {
		InsegnanteResponseDTO dto = new InsegnanteResponseDTO();
		BeanUtils.copyProperties(insegnante, dto);
		return dto;
	}

}
