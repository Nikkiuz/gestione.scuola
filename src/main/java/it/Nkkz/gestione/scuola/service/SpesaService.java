package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.SpesaRequestDTO;
import it.Nkkz.gestione.scuola.dto.SpesaResponseDTO;
import it.Nkkz.gestione.scuola.entity.Spesa;
import it.Nkkz.gestione.scuola.repository.SpesaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpesaService {

	@Autowired
	private SpesaRepository spesaRepository;

	// Recupera tutte le spese
	public List<SpesaResponseDTO> getAllSpese() {
		return spesaRepository.findAll().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// Recupera una spesa per ID
	public SpesaResponseDTO getSpesaById(Long id) {
		Spesa spesa = spesaRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Spesa non trovata con ID: " + id));
		return convertToResponseDTO(spesa);
	}

	// Aggiunge una nuova spesa
	public SpesaResponseDTO createSpesa(SpesaRequestDTO dto) {
		Spesa spesa = new Spesa();
		BeanUtils.copyProperties(dto, spesa);
		Spesa savedSpesa = spesaRepository.save(spesa);
		return convertToResponseDTO(savedSpesa);
	}

	// Modifica una spesa esistente
	public SpesaResponseDTO updateSpesa(Long id, SpesaRequestDTO dto) {
		Spesa spesa = spesaRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Spesa non trovata con ID: " + id));

		// Aggiorna solo i campi forniti
		BeanUtils.copyProperties(dto, spesa, "id");
		Spesa updatedSpesa = spesaRepository.save(spesa);
		return convertToResponseDTO(updatedSpesa);
	}

	// Elimina una spesa
	public void deleteSpesa(Long id) {
		if (!spesaRepository.existsById(id)) {
			throw new EntityNotFoundException("Spesa non trovata con ID: " + id);
		}
		spesaRepository.deleteById(id);
	}

	public List<SpesaResponseDTO> getSpeseFiltrate(Integer anno, Integer mese, Spesa.CategoriaSpesa categoria) {
		if (anno != null && mese != null) {
			YearMonth ym = YearMonth.of(anno, mese);
			LocalDate inizio = ym.atDay(1);
			LocalDate fine = ym.atEndOfMonth();

			return spesaRepository.findAll().stream()
				.filter(s -> categoria == null || s.getCategoria() == categoria)
				.filter(s -> s.getDataSpesa() != null &&
					!s.getDataSpesa().isBefore(inizio) &&
					!s.getDataSpesa().isAfter(fine))
				.map(this::convertToResponseDTO)
				.collect(Collectors.toList());
		}

		// Se anno o mese sono nulli, filtra solo per categoria (se presente)
		return spesaRepository.findAll().stream()
			.filter(s -> categoria == null || s.getCategoria() == categoria)
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}


	// Converte una Spesa in DTO per la risposta
	private SpesaResponseDTO convertToResponseDTO(Spesa spesa) {
		SpesaResponseDTO dto = new SpesaResponseDTO();
		BeanUtils.copyProperties(spesa, dto);
		return dto;
	}
}
