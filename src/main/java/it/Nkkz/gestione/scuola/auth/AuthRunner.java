package it.Nkkz.gestione.scuola.auth;

import it.Nkkz.gestione.scuola.entity.app_users.AppUser;
import it.Nkkz.gestione.scuola.service.AppUserService;
import it.Nkkz.gestione.scuola.entity.app_users.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.Set;

@Component
public class AuthRunner implements ApplicationRunner {

    @Autowired
    private AppUserService appUserService;  // DEVE ESSERE IMPORTATO CORRETTAMENTE

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // Creazione dell'utente Admin se non esiste
        Optional<AppUser> adminUser = appUserService.findByUsername("admin");  // VERIFICHIAMO CHE QUESTO SIA RICONOSCIUTO
        if (adminUser.isEmpty()) {
            appUserService.registerUser("admin", "admin@mail.com", "adminpwd", Set.of(Role.ROLE_ADMIN));
        }

        // Creazione dell'utente Insegnante se non esiste
        Optional<AppUser> normalUser = appUserService.findByUsername("utente");
        if (normalUser.isEmpty()) {
            appUserService.registerUser("utente", "utente@mail.com", "utentepwd", Set.of(Role.ROLE_INSEGNANTE));
        }
    }
}

