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

<<<<<<< Updated upstream
	// ✅ Recupera tutti gli studenti
=======
	@Autowired
	private InsegnanteRepository insegnanteRepository;

	//Recupera tutti gli studenti
>>>>>>> Stashed changes
	public List<StudenteResponseDTO> getAllStudenti() {
		return studenteRepository.findAll().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	//Recupera uno studente per ID
	public StudenteResponseDTO getStudenteById(Long id) {
		Studente studente = studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + id));
		return convertToResponseDTO(studente);
	}

<<<<<<< Updated upstream
	// ✅ Recupera studenti per lingua e livello iniziale
	public List<StudenteResponseDTO> getStudentiByLinguaELivello(String lingua, String livello) {
=======
	//Recupera studenti per lingua e livello (ORA SENZA STRINGHE)
	public List<StudenteResponseDTO> getStudentiByLinguaELivello(String lingua, Livello livello) {
>>>>>>> Stashed changes
		return studenteRepository.findByLinguaDaImparareAndLivello(lingua, livello).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	//Recupera gli studenti di un insegnante specifico
	public List<StudenteResponseDTO> getStudentiByInsegnante(Long insegnanteId) {
		return studenteRepository.findByInsegnanteId(insegnanteId).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	//Recupera studenti per tipo di corso (privato o di gruppo)
	public List<StudenteResponseDTO> getStudentiByTipoCorso(boolean corsoPrivato) {
		return studenteRepository.findByCorsoPrivato(corsoPrivato).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	//Crea uno studente
	public StudenteResponseDTO createStudente(StudenteRequestDTO studenteRequestDTO) {
		Studente studente = new Studente();
		BeanUtils.copyProperties(studenteRequestDTO, studente);
		studenteRepository.save(studente);
		return convertToResponseDTO(studente);
	}

<<<<<<< Updated upstream
	// ✅ Modifica uno studente
	public StudenteResponseDTO updateStudente(Long id, StudenteRequestDTO studenteRequestDTO) {
		Studente studente = studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + id));
		BeanUtils.copyProperties(studenteRequestDTO, studente);
		studenteRepository.save(studente);
		return convertToResponseDTO(studente);
	}

	// ✅ Elimina uno studente
=======

	//Modifica uno studente
	public StudenteResponseDTO updateStudente(Long id, StudenteRequestDTO studenteRequestDTO) {
		Studente studente = studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + id));

		// Copia le proprietà dal DTO allo studente
		BeanUtils.copyProperties(studenteRequestDTO, studente, "livello", "insegnanteId");

		//Se il livello è presente, lo assegna direttamente
		if (studenteRequestDTO.getLivello() != null) {
			studente.setLivello(studenteRequestDTO.getLivello());
		}

		//Se il frontend ha inviato un insegnanteId, aggiornalo
		if (studenteRequestDTO.getInsegnanteId() != null) {
			Insegnante insegnante = insegnanteRepository.findById(studenteRequestDTO.getInsegnanteId())
				.orElseThrow(() -> new EntityNotFoundException("Insegnante non trovato con ID: " + studenteRequestDTO.getInsegnanteId()));
			studente.setInsegnante(insegnante);
		}
		// ⚠️ Se il frontend NON ha inviato insegnanteId, non lo azzeriamo!

		// Salva lo studente aggiornato
		studente = studenteRepository.save(studente);
		return convertToResponseDTO(studente);
	}


	//Elimina uno studente
>>>>>>> Stashed changes
	public void deleteStudente(Long id) {
		studenteRepository.deleteById(id);
	}

<<<<<<< Updated upstream
	// ✅ Converte un'entità Studente in DTO
	private StudenteResponseDTO convertToResponseDTO(Studente studente) {
		StudenteResponseDTO dto = new StudenteResponseDTO();
		BeanUtils.copyProperties(studente, dto);
=======
	//Recupera gli studenti senza corso
	public List<Studente> getStudentiSenzaCorso() {
		return studenteRepository.findStudentiSenzaCorso();
	}

	private StudenteResponseDTO convertToResponseDTO(Studente studente) {
		StudenteResponseDTO dto = new StudenteResponseDTO();
		BeanUtils.copyProperties(studente, dto);

		if (studente.getInsegnante() != null) {
			dto.setInsegnanteId(studente.getInsegnante().getId());
			dto.setInsegnanteNome(studente.getInsegnante().getNome());
			dto.setInsegnanteCognome(studente.getInsegnante().getCognome());
		}

		//Mappa i corsi attivi in modo compatto
		if (studente.getCorsi() != null && !studente.getCorsi().isEmpty()) {
			List<StudenteResponseDTO.CorsoAttivo> corsiDTO = studente.getCorsi().stream()
				.map(c -> new StudenteResponseDTO.CorsoAttivo(c.getId(), c.isAttivo()))
				.toList();
			dto.setCorsi(corsiDTO);
		}

>>>>>>> Stashed changes
		return dto;
	}
}
