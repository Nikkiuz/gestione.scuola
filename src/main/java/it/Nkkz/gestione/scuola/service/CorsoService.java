package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.*;
import it.Nkkz.gestione.scuola.entity.*;
import it.Nkkz.gestione.scuola.repository.AulaRepository;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
import it.Nkkz.gestione.scuola.repository.InsegnanteRepository;
import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CorsoService {

	@Autowired
	private CorsoRepository corsoRepository;

	@Autowired
	private StudenteRepository studenteRepository;

	@Autowired
	private AulaRepository aulaRepository;

<<<<<<< Updated upstream
	// ✅ Recupera tutti i corsi attivi (Admin)
=======
	@Autowired
	private InsegnanteRepository insegnanteRepository;

	private Map<Long, List<Studente>> listaDiAttesa = new HashMap<>();

	//Recupera tutti i corsi attivi (Admin)
>>>>>>> Stashed changes
	public List<CorsoResponseDTO> getTuttiICorsi() {
		return corsoRepository.findByAttivoTrue().stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	//Recupera i corsi di un insegnante
	public List<CorsoResponseDTO> getCorsiByInsegnante(Long insegnanteId) {
		return corsoRepository.findByInsegnanteIdAndAttivoTrue(insegnanteId).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

<<<<<<< Updated upstream
	// ✅ Recupera corsi per giorno e orario
=======
	public CorsoResponseDTO getCorsoById(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato con ID: " + id));
		return convertToResponseDTO(corso);
	}


	//Recupera corsi per giorno e orario
>>>>>>> Stashed changes
	public List<CorsoResponseDTO> getCorsiByGiornoEOrario(String giorno, String orario) {
		return corsoRepository.findByGiornoAndOrarioAndAttivoTrue(giorno, orario).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

<<<<<<< Updated upstream
	// ✅ Recupera corsi per lingua e livello
	public List<CorsoResponseDTO> getCorsiByLinguaELivello(String lingua, String livello) {
=======
	//Recupera corsi per lingua e livello (ORA SENZA STRINGHE)
	public List<CorsoResponseDTO> getCorsiByLinguaELivello(String lingua, Livello livello) {
>>>>>>> Stashed changes
		return corsoRepository.findByLinguaAndLivelloAndAttivoTrue(lingua, livello).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	//Recupera corsi per tipologia (privati o di gruppo)
	public List<CorsoResponseDTO> getCorsiByTipologia(String tipoCorso) {
		return corsoRepository.findByTipoCorsoAndAttivoTrue(tipoCorso).stream()
			.map(this::convertToResponseDTO)
			.collect(Collectors.toList());
	}

	//Crea un nuovo corso
	public CorsoResponseDTO creaCorso(CorsoRequestDTO request) {
<<<<<<< Updated upstream
=======
		Optional<Aula> aulaOpt = aulaRepository.findById(request.getAulaId());
		if (aulaOpt.isEmpty()) {
			throw new EntityNotFoundException("Aula non trovata con ID: " + request.getAulaId());
		}

		Aula aula = aulaOpt.get();

		// Controlla se l'aula è già occupata per giorno e orario
		List<Corso> corsiEsistenti = corsoRepository.findByAulaIdAndGiornoAndOrarioAndAttivoTrue(
			aula.getId(), request.getGiorno(), request.getOrario());

		if (!corsiEsistenti.isEmpty()) {
			throw new IllegalStateException("L'aula è già occupata per il giorno " + request.getGiorno() +
				" alle " + request.getOrario());
		}

>>>>>>> Stashed changes
		Corso corso = new Corso();
		BeanUtils.copyProperties(request, corso);
		corso.setSecondoGiorno(request.getSecondoGiorno());
		corso.setSecondoOrario(request.getSecondoOrario());
		corso.setAula(aula);
		corso.setStudenti(studenteRepository.findAllById(request.getStudentiIds()));
		corso.setAttivo(true);

		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}

<<<<<<< Updated upstream
	// ✅ Modifica un corso esistente
=======

	//Modifica un corso esistente
>>>>>>> Stashed changes
	public CorsoResponseDTO modificaCorso(Long id, CorsoRequestDTO request) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

<<<<<<< Updated upstream
=======
		Optional<Aula> aulaOpt = aulaRepository.findById(request.getAulaId());
		if (aulaOpt.isEmpty()) {
			throw new EntityNotFoundException("Aula non trovata con ID: " + request.getAulaId());
		}
		Aula aula = aulaOpt.get();

		// Controlla che non ci siano altri corsi nella stessa aula, giorno e orario
		List<Corso> corsiEsistenti = corsoRepository.findByAulaIdAndGiornoAndOrarioAndAttivoTrue(
			aula.getId(), request.getGiorno(), request.getOrario());

		boolean sovrapposto = corsiEsistenti.stream()
			.anyMatch(c -> !c.getId().equals(corso.getId())); // Ignora se stesso

		if (sovrapposto) {
			throw new IllegalStateException("Impossibile modificare: l'aula è già occupata per quel giorno/orario.");
		}

>>>>>>> Stashed changes
		BeanUtils.copyProperties(request, corso, "id");
		corso.setSecondoGiorno(request.getSecondoGiorno());
		corso.setSecondoOrario(request.getSecondoOrario());
		corso.setAula(aula);
		corso.setStudenti(studenteRepository.findAllById(request.getStudentiIds()));

		corsoRepository.save(corso);
		return convertToResponseDTO(corso);
	}

<<<<<<< Updated upstream
	// ✅ **Interrompi un corso** (senza eliminarlo)
=======

	//Interrompi un corso (senza eliminarlo)
>>>>>>> Stashed changes
	public void interrompiCorso(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		corso.setAttivo(false);
		corsoRepository.save(corso);
	}

<<<<<<< Updated upstream
	// ✅ **Elimina definitivamente un corso**
=======
	//Elimina definitivamente un corso
>>>>>>> Stashed changes
	public void eliminaCorso(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		corsoRepository.deleteById(id);
	}

<<<<<<< Updated upstream
	// ✅ **Gestione corsi pieni**
=======
	//Gestione corsi pieni
>>>>>>> Stashed changes
	public void gestisciCorsoPieno(Long corsoId, int scelta) {
		Corso corso = corsoRepository.findById(corsoId)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato"));

		switch (scelta) {
			case 1:
				dividiCorso(corso);
				break;
			case 2:
				aggiungiPostoExtra(corso);
				break;
			default:
				throw new IllegalArgumentException("Scelta non valida");
		}
	}

<<<<<<< Updated upstream
	// ✅ **Dividere un corso in due gruppi più piccoli**
=======
	//Dividere un corso in due gruppi più piccoli
>>>>>>> Stashed changes
	private void dividiCorso(Corso corso) {
		List<Studente> studenti = new ArrayList<>(corso.getStudenti());

		if (studenti.size() < 2) {
			throw new IllegalArgumentException("Impossibile dividere un corso con meno di 2 studenti.");
		}

		int metà = studenti.size() / 2;

		List<Studente> primoGruppo = new ArrayList<>(studenti.subList(0, metà));
		List<Studente> secondoGruppo = new ArrayList<>(studenti.subList(metà, studenti.size()));

		Corso corso1 = new Corso(corso, primoGruppo);
		Corso corso2 = new Corso(corso, secondoGruppo);

		corsoRepository.save(corso1);
		corsoRepository.save(corso2);
	}

<<<<<<< Updated upstream
	// ✅ **Aggiungere un posto extra al corso pieno**
=======
	//Aggiungere un posto extra al corso pieno
>>>>>>> Stashed changes
	private void aggiungiPostoExtra(Corso corso) {
		System.out.println("Posto extra aggiunto al corso " + corso.getLingua());
	}

	public void generaCorsiAutomaticamente() {
		System.out.println("✅ Inizio generazione automatica corsi...");

		List<Studente> studentiDisponibili = new ArrayList<>(
			studenteRepository.findStudentiSenzaCorso().stream()
				.filter(s -> !s.isCorsoPrivato())
				.toList()
		);

		System.out.println("Studenti disponibili: " + studentiDisponibili.size());

		if (studentiDisponibili.isEmpty()) {
			System.out.println("⚠️ Nessuno studente disponibile per la generazione dei corsi.");
			return;
		}

		List<Corso> nuoviCorsi = new ArrayList<>();
		List<Corso> corsiEsistenti = corsoRepository.findByAttivoTrue();
		List<Set<Studente>> listaDiAttesa = new ArrayList<>();

		while (!studentiDisponibili.isEmpty()) {
			Studente studente = studentiDisponibili.get(0);

			Optional<String> giornoCompatibile = studente.getGiorniPreferiti().stream().findFirst();
			Optional<String> orarioCompatibile = studente.getFasceOrariePreferite().stream().findFirst();

			System.out.println("Giorno compatibile: " + giornoCompatibile.orElse("Nessuno"));
			System.out.println("Orario compatibile: " + orarioCompatibile.orElse("Nessuno"));

			if (giornoCompatibile.isEmpty() || orarioCompatibile.isEmpty()) {
				studentiDisponibili.remove(studente);
				continue;
			}

			List<Studente> gruppoCompatibile = studentiDisponibili.stream()
				.filter(s -> s.getLinguaDaImparare().equalsIgnoreCase(studente.getLinguaDaImparare()))
				.filter(s -> s.getLivello() == studente.getLivello())
				.filter(s -> Math.abs(s.getEta() - studente.getEta()) <= 2)
				.filter(s -> Objects.equals(s.getTipoCorsoGruppo(), studente.getTipoCorsoGruppo()))
				.filter(s -> s.getGiorniPreferiti().contains(giornoCompatibile.get()))
				.filter(s -> {
					boolean match = s.getFasceOrariePreferite().contains(orarioCompatibile.get());
					if (!match) {
						boolean orarioSimile = s.getFasceOrariePreferite().stream()
							.anyMatch(o -> o.length() >= 5 && orarioCompatibile.get().startsWith(o.substring(0, 5)));
						return orarioSimile;
					}
					return true;
				})
				.collect(Collectors.toList());

			gruppoCompatibile.add(studente);
			Set<Studente> gruppoUnico = new HashSet<>(gruppoCompatibile);

			if (gruppoUnico.size() < 3) {
				System.out.println("⚠️ Gruppo troppo piccolo, aggiunto alla lista di attesa.");
				listaDiAttesa.add(gruppoUnico);
				studentiDisponibili.removeAll(gruppoUnico);
				continue;
			}

			List<Studente> listaGruppo = new ArrayList<>(gruppoUnico);
			int index = 0;

			while (index < listaGruppo.size()) {
				Optional<Aula> aulaDisponibile = aulaRepository.findAll().stream()
					.filter(a -> a.getCapienzaMax() >= listaGruppo.size())
					.filter(a -> corsiEsistenti.stream().noneMatch(c ->
						c.getAula() != null &&
							c.getAula().getId().equals(a.getId()) &&
							(
								(c.getGiorno().equals(giornoCompatibile.get()) && c.getOrario().equals(orarioCompatibile.get())) ||
									("2 volte a settimana".equalsIgnoreCase(studente.getTipoCorsoGruppo()) &&
										c.getSecondoGiorno() != null && c.getSecondoOrario() != null &&
										c.getSecondoGiorno().equals(giornoCompatibile.get()) &&
										c.getSecondoOrario().equals(orarioCompatibile.get()))
							)
					))
					.findFirst();

				if (aulaDisponibile.isEmpty()) {
					System.out.println("⚠️ Nessuna aula disponibile per questo orario.");
					index = listaGruppo.size();
					continue;
				}

				int capienzaMassima = aulaDisponibile.map(Aula::getCapienzaMax).orElse(10);
				int fine = Math.min(index + capienzaMassima, listaGruppo.size());
				List<Studente> sottoGruppo = listaGruppo.subList(index, fine);

				Optional<Insegnante> insegnanteOpt = (studente.getInsegnante() != null)
					? insegnanteRepository.findById(studente.getInsegnante().getId())
					: insegnanteRepository.findAll().stream()
					.filter(i -> i.getLingua().equalsIgnoreCase(studente.getLinguaDaImparare()))
					.findFirst();

				if (insegnanteOpt.isEmpty()) {
					index = fine;
					continue;
				}

				Corso corso = new Corso();
				corso.setLingua(studente.getLinguaDaImparare());
				corso.setLivello(studente.getLivello());
				corso.setTipoCorso("GRUPPO");
				corso.setFrequenza(studente.getTipoCorsoGruppo());
				corso.setGiorno(giornoCompatibile.get());
				corso.setOrario(orarioCompatibile.get());
				corso.setInsegnante(insegnanteOpt.get());
				corso.setAula(aulaDisponibile.get());
				corso.setStudenti(new ArrayList<>(sottoGruppo));
				corso.setAttivo(true);

				corsoRepository.save(corso);
			}
		}
	}

<<<<<<< Updated upstream
	// ✅ **Conversione Entity → DTO**
	private CorsoResponseDTO convertToResponseDTO(Corso corso) {
		CorsoResponseDTO dto = new CorsoResponseDTO();
		BeanUtils.copyProperties(corso, dto);
=======
	//Metodo per ottenere tutti i corsi non attivi
	public List<CorsoResponseDTO> getCorsiDisattivati() {
		List<Corso> corsi = corsoRepository.findByAttivoFalse();
		return corsi.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
	}

	//Metodo per riattivare un corso
	public void riattivaCorso(Long id) {
		Corso corso = corsoRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato con ID: " + id));

		if (corso.isAttivo()) {
			throw new IllegalStateException("Il corso è già attivo.");
		}

		//Controllo per evitare sovrapposizioni nell'aula
		List<Corso> corsiEsistenti = corsoRepository.findByAulaIdAndGiornoAndOrarioAndAttivoTrue(
			corso.getAula().getId(), corso.getGiorno(), corso.getOrario());

		if (!corsiEsistenti.isEmpty()) {
			throw new IllegalStateException("Impossibile riattivare il corso: l'aula è già occupata in quel giorno/orario.");
		}

		corso.setAttivo(true);
		corsoRepository.save(corso);
	}


	//Metodo per ottenere la lista di attesa raggruppata per corso
	public List<List<String>> getGruppiListaDiAttesa() {
		return listaDiAttesa.values().stream()
			.map(gruppo -> gruppo.stream()
				.map(Studente::getNome)
				.collect(Collectors.toList()))
			.collect(Collectors.toList());
	}


	//Metodo per ottenere la lista di attesa raggruppata per corso fittizio (o criterio)
	public List<StudenteResponseDTO> getListaDiAttesa() {
		return listaDiAttesa.values().stream()
			.flatMap(List::stream)
			.map(studente -> {
				StudenteResponseDTO dto = new StudenteResponseDTO();
				BeanUtils.copyProperties(studente, dto);
				return dto;
			})
			.collect(Collectors.toList());
	}
	
	public void aggiungiStudente(Long corsoId, Long studenteId) {
		Corso corso = corsoRepository.findById(corsoId)
			.orElseThrow(() -> new EntityNotFoundException("Corso non trovato con ID: " + corsoId));
		Studente studente = studenteRepository.findById(studenteId)
			.orElseThrow(() -> new EntityNotFoundException("Studente non trovato con ID: " + studenteId));

		// Aggiungi lo studente alla lista
		List<Studente> studenti = corso.getStudenti();
		if (!studenti.contains(studente)) {
			studenti.add(studente);
			corsoRepository.save(corso);
		} else {
			throw new IllegalArgumentException("Lo studente è già assegnato a questo corso.");
		}
	}


	//Metodo per convertire un Corso in CorsoResponseDTO
	public CorsoResponseDTO convertToResponseDTO(Corso corso) {
		CorsoResponseDTO dto = new CorsoResponseDTO();
		BeanUtils.copyProperties(corso, dto);


		// Aggiungi il campo "attivo"
		dto.setAttivo(corso.isAttivo());
		dto.setSecondoGiorno(corso.getSecondoGiorno());
		dto.setSecondoOrario(corso.getSecondoOrario());

		//Assegna manualmente l'insegnante
		if (corso.getInsegnante() != null) {
			InsegnanteResponseDTO insegnanteDTO = new InsegnanteResponseDTO();
			BeanUtils.copyProperties(corso.getInsegnante(), insegnanteDTO);
			dto.setInsegnante(insegnanteDTO);
		}

		//Assegna manualmente l'aula
		if (corso.getAula() != null) {
			AulaResponseDTO aulaDTO = new AulaResponseDTO();
			BeanUtils.copyProperties(corso.getAula(), aulaDTO);
			dto.setAula(aulaDTO);
		}

		//Mappa gli studenti in StudenteResponseDTO
		if (corso.getStudenti() != null && !corso.getStudenti().isEmpty()) {
			List<StudenteResponseDTO> studentiDTO = corso.getStudenti().stream().map(studente -> {
				StudenteResponseDTO sDTO = new StudenteResponseDTO();
				BeanUtils.copyProperties(studente, sDTO);
				return sDTO;
			}).collect(Collectors.toList());
			dto.setStudenti(studentiDTO);
		}

>>>>>>> Stashed changes
		return dto;
	}

}