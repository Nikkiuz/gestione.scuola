package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.StudenteRequestDTO;
import it.Nkkz.gestione.scuola.dto.StudenteResponseDTO;
import it.Nkkz.gestione.scuola.entity.Insegnante;
import it.Nkkz.gestione.scuola.entity.Livello;
import it.Nkkz.gestione.scuola.entity.Studente;
import it.Nkkz.gestione.scuola.repository.InsegnanteRepository;
import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StudenteService {

	@Autowired
	private StudenteRepository studenteRepository;

	@Autowired
	private InsegnanteRepository insegnanteRepository;

	// Recupera tutti gli studenti
	public List<StudenteResponseDTO> getAllStudenti() {
		return studenteRepository.findAll().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// Recupera uno studente per ID
	public StudenteResponseDTO getStudenteById(Long id) {
		Studente studente = studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + id));
		return convertToResponseDTO(studente);
	}

	// Recupera studenti per lingua e livello (ORA SENZA STRINGHE)
	public List<StudenteResponseDTO> getStudentiByLinguaELivello(String lingua, Livello livello) {
		return studenteRepository.findByLinguaDaImparareAndLivello(lingua, livello).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// Recupera gli studenti di un insegnante specifico
	public List<StudenteResponseDTO> getStudentiByInsegnante(Long insegnanteId) {
		return studenteRepository.findByInsegnanteId(insegnanteId).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// Recupera studenti per tipo di corso (privato o di gruppo)
	public List<StudenteResponseDTO> getStudentiByTipoCorso(boolean corsoPrivato) {
		return studenteRepository.findByCorsoPrivato(corsoPrivato).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	// Crea uno studente
	public StudenteResponseDTO createStudente(StudenteRequestDTO studenteRequestDTO) {

		Studente studente = new Studente();
		BeanUtils.copyProperties(studenteRequestDTO, studente, "livello", "insegnanteId");

		if (studenteRequestDTO.getLivello() != null) {
			studente.setLivello(studenteRequestDTO.getLivello());
		}

		if (studenteRequestDTO.getInsegnanteId() != null) {
			Insegnante insegnante = insegnanteRepository.findById(studenteRequestDTO.getInsegnanteId())
				.orElseThrow(() -> new EntityNotFoundException("Insegnante non trovato con ID: " + studenteRequestDTO.getInsegnanteId()));
			studente.setInsegnante(insegnante);
		} else {
			System.out.println("❌ Nessun insegnante assegnato!");
		}

		if (studenteRequestDTO.getDataIscrizione() != null) {
			studente.setDataIscrizione(studenteRequestDTO.getDataIscrizione());
		} else {
			studente.setDataIscrizione(LocalDate.now());
		}

		studente = studenteRepository.save(studente);
		return convertToResponseDTO(studente);
	}


	// Modifica uno studente
	public StudenteResponseDTO updateStudente(Long id, StudenteRequestDTO studenteRequestDTO) {
		Studente studente = studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + id));

		// Copia le proprietà dal DTO allo studente
		BeanUtils.copyProperties(studenteRequestDTO, studente, "livello", "insegnanteId");

		// Se il livello è presente, lo assegna direttamente
		if (studenteRequestDTO.getLivello() != null) {
			studente.setLivello(studenteRequestDTO.getLivello());
		}

		// Se il frontend ha inviato un insegnanteId, aggiornalo
		if (studenteRequestDTO.getInsegnanteId() != null) {
			Insegnante insegnante = insegnanteRepository.findById(studenteRequestDTO.getInsegnanteId())
				.orElseThrow(() -> new EntityNotFoundException("Insegnante non trovato con ID: " + studenteRequestDTO.getInsegnanteId()));
			studente.setInsegnante(insegnante);
		}

		if (studenteRequestDTO.getDataIscrizione() != null) {
			studente.setDataIscrizione(studenteRequestDTO.getDataIscrizione());
		}

		// Salva lo studente aggiornato
		studente = studenteRepository.save(studente);
		return convertToResponseDTO(studente);
	}


	// Elimina uno studente
	public void deleteStudente(Long id) {
		if (!studenteRepository.existsById(id)) {
			throw new EntityNotFoundException("❌ Studente non trovato con ID: " + id);
		}
		studenteRepository.deleteById(id);
	}

	// Recupera gli studenti senza corso
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

		// Mappa i corsi attivi in modo compatto
		if (studente.getCorsi() != null && !studente.getCorsi().isEmpty()) {
			List<StudenteResponseDTO.CorsoAttivo> corsiDTO = studente.getCorsi().stream()
				.map(c -> new StudenteResponseDTO.CorsoAttivo(c.getId(), c.isAttivo()))
				.toList();
			dto.setCorsi(corsiDTO);
		}

		return dto;
	}


	public Map<YearMonth, Long> getIscrizioniMensili() {
		List<Studente> studenti = studenteRepository.findAll();
		return studenti.stream()
			.filter(s -> s.getDataIscrizione() != null)
			.collect(Collectors.groupingBy(
				s -> YearMonth.from(s.getDataIscrizione()),
				Collectors.counting()
			));
	}

	public Map<Integer, Long> getIscrizioniAnnuali() {
		List<Studente> studenti = studenteRepository.findAll();
		return studenti.stream()
			.filter(s -> s.getDataIscrizione() != null)
			.collect(Collectors.groupingBy(
				s -> s.getDataIscrizione().getYear(),
				Collectors.counting()
			));
	}


}
