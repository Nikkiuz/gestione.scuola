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
<<<<<<< Updated upstream
        // Creazione dell'utente Admin se non esiste
        Optional<AppUser> adminUser = appUserService.findByUsername("admin");  // VERIFICHIAMO CHE QUESTO SIA RICONOSCIUTO
=======
        createAdminUser();
        /*createStandardUser();*/
    }

    /**
     * Crea un utente Admin se non esiste già.
     */
    private void createAdminUser() {
        Optional<AppUser> adminUser = appUserService.findByUsername("admin");
>>>>>>> Stashed changes
        if (adminUser.isEmpty()) {
            appUserService.registerUser("admin", "admin@mail.com", "adminpwd", Set.of(Role.ROLE_ADMIN));
        }

<<<<<<< Updated upstream
        // Creazione dell'utente Insegnante se non esiste
        Optional<AppUser> normalUser = appUserService.findByUsername("utente");
        if (normalUser.isEmpty()) {
            appUserService.registerUser("utente", "utente@mail.com", "utentepwd", Set.of(Role.ROLE_INSEGNANTE));
=======
    /*
     * Crea un utente standard se non esiste già.

    private void createStandardUser() {
        Optional<AppUser> userUser = appUserService.findByUsername("user");
        if (userUser.isEmpty()) {
            appUserService.registerUser("user", "user@mail.com", "userpwd", Role.ROLE_USER);
            System.out.println("✅ Utente Standard creato con successo!");
>>>>>>> Stashed changes
        }
    }
     */
}

