package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.PagamentoMensileDTO;
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
		Studente studente = studenteRepository.findById(requestDTO.getStudenteId())
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato"));

		Pagamento pagamento = new Pagamento();
		BeanUtils.copyProperties(requestDTO, pagamento);
		pagamento.setStudente(studente);
		pagamento.setNumeroRicevuta(UUID.randomUUID().toString()); // Genera un numero di ricevuta unico

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
		Pagamento pagamento = pagamentoRepository.findById(pagamentoId)
			.orElseThrow(() -> new EntityNotFoundException("Pagamento non trovato"));
		pagamentoRepository.delete(pagamento);
	}

	// 🔹 Converte da Pagamento a PagamentoResponseDTO
	private PagamentoResponseDTO convertToResponseDTO(Pagamento pagamento) {
		PagamentoResponseDTO dto = new PagamentoResponseDTO();
		BeanUtils.copyProperties(pagamento, dto);
		dto.setStudenteNome(pagamento.getStudente().getNome() + " " + pagamento.getStudente().getCognome());
		return dto;
	}

	// ✅ Recupera il totale dei pagamenti suddivisi per mese (per la Dashboard)
	public PagamentoMensileDTO getPagamentiMensili() {
		List<Object[]> results = pagamentoRepository.getPagamentiMensili();

		List<String> mesi = results.stream()
			.map(result -> (String) result[0])
			.toList();

		List<Double> importi = results.stream()
			.map(result -> (Double) result[1])
			.toList();

		return new PagamentoMensileDTO(mesi, importi);
	}

}
