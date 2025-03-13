package it.Nkkz.gestione.scuola.config;

import it.Nkkz.gestione.scuola.auth.JwtAuthenticationEntryPoint;
import it.Nkkz.gestione.scuola.auth.JwtRequestFilter;
import it.Nkkz.gestione.scuola.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

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
			.cors(cors -> cors.configurationSource(request -> {
				CorsConfiguration config = new CorsConfiguration();
				config.setAllowedOrigins(List.of("http://localhost:5173")); // Permetti richieste solo da localhost:5173
				config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
				config.setAllowedHeaders(List.of("*"));
				return config;
			}))
			.csrf(csrf -> csrf.disable()) // 🔴 Disabilitiamo CSRF perché usiamo JWT
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/api/auth/**").permitAll() // ✅ Accesso libero a login e registrazione
				.requestMatchers("/api/admin/**").hasRole("ADMIN") // 🔐 Solo Admin può gestire tutto
				.anyRequest().authenticated() // 🔒 Tutti gli altri endpoint richiedono autenticazione
			)
			.exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint)) // 🔐 Gestione errori di autenticazione
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // ❌ Disabilitiamo sessioni
			.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class); // ✅ Aggiungiamo il filtro JWT

		return http.build();
	}

	// 🔹 Usa il nostro CustomUserDetailsService e imposta l'email come chiave di autenticazione
	@Bean
	public UserDetailsService userDetailsService(CustomUserDetailsService customUserDetailsService) {
		return customUserDetailsService;
	}

	// 🔹 Impostiamo il provider di autenticazione per usare l'email al posto dello username
	@Bean
	public DaoAuthenticationProvider authenticationProvider(CustomUserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailsService);
		authProvider.setPasswordEncoder(passwordEncoder);
		return authProvider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
