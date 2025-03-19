package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.PagamentoRequestDTO;
import it.Nkkz.gestione.scuola.dto.PagamentoResponseDTO;
import it.Nkkz.gestione.scuola.entity.Pagamento;
import it.Nkkz.gestione.scuola.entity.Studente;
import it.Nkkz.gestione.scuola.repository.PagamentoRepository;
import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.BeanUtils;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PagamentoService {

	private final PagamentoRepository pagamentoRepository;
	private final StudenteRepository studenteRepository;

	// ✅ Registra un nuovo pagamento
	@Transactional
	public PagamentoResponseDTO registraPagamento(PagamentoRequestDTO requestDTO) {
		// Verifica che lo studente esista
		Studente studente = studenteRepository.findById(requestDTO.getStudenteId())
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + requestDTO.getStudenteId()));

		// Crea un nuovo pagamento
		Pagamento pagamento = new Pagamento();
		BeanUtils.copyProperties(requestDTO, pagamento);
		pagamento.setStudente(studente);
		pagamento.setNumeroRicevuta(UUID.randomUUID().toString()); // Genera un numero di ricevuta unico

		// Salva il pagamento
		pagamentoRepository.save(pagamento);
		return convertToResponseDTO(pagamento);
	}

	// ✅ Recupera tutti i pagamenti
	public List<PagamentoResponseDTO> getTuttiIPagamenti() {
		return pagamentoRepository.findAll().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera i pagamenti di un singolo studente
	public List<PagamentoResponseDTO> getPagamentiByStudente(Long studenteId) {
		return pagamentoRepository.findByStudenteId(studenteId).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera i pagamenti per una specifica mensilità
	public List<PagamentoResponseDTO> getPagamentiByMensilita(String mensilita) {
		return pagamentoRepository.findByMensilitaSaldata(mensilita).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Elimina un pagamento
	@Transactional
	public void eliminaPagamento(Long pagamentoId) {
		// Verifica che il pagamento esista
		Pagamento pagamento = pagamentoRepository.findById(pagamentoId)
			.orElseThrow(() -> new EntityNotFoundException("Pagamento non trovato con ID: " + pagamentoId));

		// Elimina il pagamento
		pagamentoRepository.delete(pagamento);
	}

	// ✅ Aggiorna un pagamento esistente
	@Transactional
	public PagamentoResponseDTO aggiornaPagamento(Long pagamentoId, PagamentoRequestDTO requestDTO) {
		// Verifica che il pagamento esista
		Pagamento pagamento = pagamentoRepository.findById(pagamentoId)
			.orElseThrow(() -> new EntityNotFoundException("Pagamento non trovato con ID: " + pagamentoId));

		// Aggiorna i campi del pagamento
		pagamento.setDataPagamento(requestDTO.getDataPagamento());
		pagamento.setImporto(requestDTO.getImporto());
		pagamento.setMensilitaSaldata(requestDTO.getMensilitaSaldata());
		pagamento.setMetodoPagamento(requestDTO.getMetodoPagamento());
		pagamento.setNumeroRicevuta(requestDTO.getNumeroRicevuta());
		pagamento.setNote(requestDTO.getNote());

		// Salva il pagamento aggiornato
		Pagamento pagamentoAggiornato = pagamentoRepository.save(pagamento);

		// Restituisci il DTO aggiornato
		return convertToResponseDTO(pagamentoAggiornato);
	}

	// 🔹 Converte da Pagamento a PagamentoResponseDTO
	private PagamentoResponseDTO convertToResponseDTO(Pagamento pagamento) {
		PagamentoResponseDTO dto = new PagamentoResponseDTO();
		BeanUtils.copyProperties(pagamento, dto);
		dto.setStudenteNome(pagamento.getStudente().getNome() + " " + pagamento.getStudente().getCognome());
		return dto;
	}
}