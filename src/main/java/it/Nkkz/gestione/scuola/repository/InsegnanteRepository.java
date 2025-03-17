package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.Insegnante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;

public interface InsegnanteRepository extends JpaRepository<Insegnante, Long> {
	Insegnante findByLingua(String lingua);
}
