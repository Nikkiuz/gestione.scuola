package it.Nkkz.gestione.scuola.config;

import it.Nkkz.gestione.scuola.auth.JwtAuthenticationEntryPoint;
import it.Nkkz.gestione.scuola.auth.JwtRequestFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final JwtRequestFilter jwtRequestFilter;

	public SecurityConfig(JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint, JwtRequestFilter jwtRequestFilter) {
		this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
		this.jwtRequestFilter = jwtRequestFilter;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable()) // 🔴 Disabilitiamo CSRF perché usiamo JWT
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/api/auth/**").permitAll() // ✅ Accesso libero a login e registrazione
				.requestMatchers("/api/admin/**").hasRole("ADMIN") // 🔐 Solo Admin può gestire tutto
				.requestMatchers("/api/insegnante/me").hasRole("INSEGNANTE") // 🔐 Un insegnante può modificare SOLO il proprio profilo
				.requestMatchers("/api/insegnante/miei-corsi").hasRole("INSEGNANTE") // 🔐 Un insegnante può vedere i suoi corsi
				.requestMatchers("/api/insegnante/change-password").hasRole("INSEGNANTE") // 🔐 Un insegnante può cambiare la password
				.anyRequest().authenticated() // 🔒 Tutti gli altri endpoint richiedono autenticazione
			)
			.exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint)) // 🔐 Gestione errori di autenticazione
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // ❌ Disabilitiamo sessioni
			.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class); // ✅ Aggiungiamo il filtro JWT

		return http.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(); // 🔐 Usiamo BCrypt per criptare le password
	}
}
