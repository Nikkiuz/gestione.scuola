package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.StudenteRequestDTO;
import it.Nkkz.gestione.scuola.dto.StudenteResponseDTO;
import it.Nkkz.gestione.scuola.entity.Studente;
import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudenteService {

	@Autowired
	private StudenteRepository studenteRepository;

	// ✅ Recupera tutti gli studenti
	public List<StudenteResponseDTO> getAllStudenti() {
		return studenteRepository.findAll().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera uno studente per ID
	public StudenteResponseDTO getStudenteById(Long id) {
		Studente studente = studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + id));
		return convertToResponseDTO(studente);
	}

	// ✅ Recupera studenti per lingua e livello iniziale
	public List<StudenteResponseDTO> getStudentiByLinguaELivello(String lingua, String livello) {
		return studenteRepository.findByLinguaDaImparareAndLivello(lingua, livello).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera gli studenti di un insegnante specifico
	public List<StudenteResponseDTO> getStudentiByInsegnante(Long insegnanteId) {
		return studenteRepository.findByInsegnanteId(insegnanteId).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Recupera studenti per tipo di corso (privato o di gruppo)
	public List<StudenteResponseDTO> getStudentiByTipoCorso(boolean corsoPrivato) {
		return studenteRepository.findByCorsoPrivato(corsoPrivato).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// ✅ Crea uno studente
	public StudenteResponseDTO createStudente(StudenteRequestDTO studenteRequestDTO) {
		// 🔹 Imposta un valore di default per tipologiaPagamento se non è specificato
		if (studenteRequestDTO.getTipologiaPagamento() == null || studenteRequestDTO.getTipologiaPagamento().isEmpty()) {
			studenteRequestDTO.setTipologiaPagamento("PACCHETTO"); // Default: pacchetto di lezioni
		}

		Studente studente = new Studente();
		BeanUtils.copyProperties(studenteRequestDTO, studente);
		studenteRepository.save(studente);
		return convertToResponseDTO(studente);
	}


	// ✅ Modifica uno studente
	public StudenteResponseDTO updateStudente(Long id, StudenteRequestDTO studenteRequestDTO) {
		Studente studente = studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + id));

		// 🔹 Se tipologiaPagamento è vuota, assegna il valore di default "SINGOLA"
		if (studenteRequestDTO.getTipologiaPagamento() == null || studenteRequestDTO.getTipologiaPagamento().isEmpty()) {
			studenteRequestDTO.setTipologiaPagamento("PACCHETTO");
		}

		BeanUtils.copyProperties(studenteRequestDTO, studente);
		studenteRepository.save(studente);
		return convertToResponseDTO(studente);
	}


	// ✅ Elimina uno studente
	public void deleteStudente(Long id) {
		studenteRepository.deleteById(id);
	}

	// ✅ Recupera gli studenti senza corso
	public List<Studente> getStudentiSenzaCorso() {
		return studenteRepository.findStudentiSenzaCorso();
	}

	// ✅ Converte un'entità Studente in DTO
	private StudenteResponseDTO convertToResponseDTO(Studente studente) {
		StudenteResponseDTO dto = new StudenteResponseDTO();
		BeanUtils.copyProperties(studente, dto);
		return dto;
	}
}
