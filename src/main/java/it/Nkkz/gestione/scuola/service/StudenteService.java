package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.entity.Studente;
import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudenteService {

	@Autowired
	private StudenteRepository studenteRepository;

	public Studente saveStudente(Studente studente) {
		return studenteRepository.save(studente);
	}

	public List<Studente> getAllStudenti() {
		return studenteRepository.findAll();
	}

	public Studente getStudenteById(Long id) {
		return studenteRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + id));
	}

	public List<Studente> getStudentiByLingua(String lingua) {
		return studenteRepository.findByLinguaDaImparare(lingua);
	}

	public List<Studente> getStudentiByInsegnante(Long insegnanteId) {
		return studenteRepository.findByInsegnanteId(insegnanteId);
	}

	public Studente updateStudente(Long id, Studente studenteDetails) {
		Studente studente = getStudenteById(id);

		studente.setNome(studenteDetails.getNome());
		studente.setCognome(studenteDetails.getCognome());
		studente.setEta(studenteDetails.getEta());
		studente.setLinguaDaImparare(studenteDetails.getLinguaDaImparare());
		studente.setLivello(studenteDetails.getLivello());
		studente.setGiorniPreferiti(studenteDetails.getGiorniPreferiti());
		studente.setFasceOrariePreferite(studenteDetails.getFasceOrariePreferite());
		studente.setCorsoPrivato(studenteDetails.isCorsoPrivato());
		studente.setFrequenzaCorsoPrivato(studenteDetails.getFrequenzaCorsoPrivato());
		studente.setTipoCorsoGruppo(studenteDetails.getTipoCorsoGruppo());
		studente.setInsegnante(studenteDetails.getInsegnante());
		studente.setTipologiaPagamento(studenteDetails.getTipologiaPagamento());

		return studenteRepository.save(studente);
	}

	public void deleteStudente(Long id) {
		Studente studente = getStudenteById(id);
		studenteRepository.delete(studente);
	}
}
