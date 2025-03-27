package it.Nkkz.gestione.scuola.auth;

import it.Nkkz.gestione.scuola.entity.app_users.AppUser;
import it.Nkkz.gestione.scuola.entity.app_users.Role;
import it.Nkkz.gestione.scuola.service.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthRunner implements ApplicationRunner {

    @Autowired
    private AppUserService appUserService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        createAdminUser();
        //createStandardUser();
    }

    private void createAdminUser() {
        Optional<AppUser> adminUser = appUserService.findByUsername("admin");
        if (adminUser.isEmpty()) {
            appUserService.registerUser("admin", "admin@mail.com", "adminpwd", Role.ROLE_ADMIN);
            System.out.println("✅ Utente Admin creato con successo!");
        }
    }

    /*
     * Crea un utente standard se non esiste già.

    private void createStandardUser() {
        Optional<AppUser> userUser = appUserService.findByUsername("user");
        if (userUser.isEmpty()) {
            appUserService.registerUser("user", "user@mail.com", "userpwd", Role.ROLE_INSEGNANTE);
            System.out.println("✅ Utente Standard creato con successo!");
        }
    }*/
}


