package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.StudenteRequestDTO;
import it.Nkkz.gestione.scuola.dto.StudenteResponseDTO;
import it.Nkkz.gestione.scuola.entity.Livello;
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

	// ✅ Recupera studenti per lingua e livello (ORA SENZA STRINGHE)
	public List<StudenteResponseDTO> getStudentiByLinguaELivello(String lingua, Livello livello) {
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

	// ✅ Crea uno studente (ORA SENZA STRINGHE)
	public StudenteResponseDTO createStudente(StudenteRequestDTO studenteRequestDTO) {
		Studente studente = new Studente();
		BeanUtils.copyProperties(studenteRequestDTO, studente, "livello");

		// ✅ Se il livello è presente, lo assegna direttamente
		if (studenteRequestDTO.getLivello() != null) {
			studente.setLivello(studenteRequestDTO.getLivello());
		}

		studente = studenteRepository.save(studente);
		return convertToResponseDTO(studente);
	}

	// ✅ Modifica uno studente (ORA SENZA STRINGHE)
	public StudenteResponseDTO updateStudente(Long id, StudenteRequestDTO studenteRequestDTO) {
		Studente studente = studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + id));

		BeanUtils.copyProperties(studenteRequestDTO, studente, "livello");

		// ✅ Se il livello è presente, lo assegna direttamente
		if (studenteRequestDTO.getLivello() != null) {
			studente.setLivello(studenteRequestDTO.getLivello());
		}

		studente = studenteRepository.save(studente);
		return convertToResponseDTO(studente);
	}

	// ✅ Elimina uno studente
	public void deleteStudente(Long id) {
		if (!studenteRepository.existsById(id)) {
			throw new EntityNotFoundException("❌ Studente non trovato con ID: " + id);
		}
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
