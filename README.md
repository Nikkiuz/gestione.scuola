# 📚 Gestione Scuola - Documentazione del Progetto

![Java](https://img.shields.io/badge/Java-21-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)

Benvenuti nel repository ufficiale di **Gestione Scuola**, un'applicazione web per la gestione di una scuola di lingue. Questo documento fornisce una panoramica completa e bilanciata del progetto, pensata per essere chiara sia agli sviluppatori che agli utenti non tecnici.

---

## 🚀 Introduzione
"Gestione Scuola" è un sistema completo per la gestione interna di una scuola di lingue. Consente all'amministratore di gestire corsi, studenti, aule, spese e pagamenti da un'unica interfaccia semplice e intuitiva.

---

## 🎯 Obiettivi del progetto
- Automatizzare la creazione dei corsi in base alle preferenze degli studenti
- Gestire l'anagrafica di studenti, insegnanti, corsi e aule
- Monitorare le spese e i pagamenti
- Offrire una dashboard interattiva con grafici e riepiloghi
- Generare PDF e report automatici

---

## 🧰 Tecnologie utilizzate

### Backend
- Java 21
- Spring Boot 3.4.3
- Spring Data JPA
- PostgreSQL
- JWT (autenticazione)
- Hibernate Validator
- iText 7 (PDF)
- SpringDoc OpenAPI (Swagger)
- Maven

### Frontend
- React + Vite
- Redux Toolkit
- React Bootstrap
- Axios

### Deploy
- Il progetto prevede il deploy su [Render](https://render.com)

---

## 🔑 Funzionalità principali

### 👨‍🎓 Gestione Studenti
- Creazione e modifica profilo
- Assegnazione a corsi
- Pagamenti e riepiloghi

### 📚 Gestione Corsi
- Corsi di gruppo e privati (1-to-1 o max 3 studenti)
- Frequenza: 1 o 2 volte a settimana
- Assegnazione automatica degli studenti ai corsi
- Gestione livelli, età e preferenze

### 🏫 Gestione Aule
- 5 aule con capienza differente
- Visualizzazione della disponibilità settimanale

### 💰 Gestione Spese e Pagamenti
- Spese con categoria (utenze, cancelleria...)
- Pagamenti associati agli studenti
- Report PDF mensili e annuali
- Invio automatico riepiloghi via email

### 📊 Dashboard & Report
- Panoramica generale
- Grafici interattivi (entrate/uscite/corsi)
- Alert su corsi pieni o in difficoltà

---

## 🔒 Sicurezza
- Login con JWT
- Accesso limitato all'amministratore
- Validazioni lato frontend e backend

---

## 🧪 API & Documentazione
- Tutte le API sono documentate tramite **Swagger UI**:
  - URL: [`/swagger-ui/index.html`](http://localhost:8080/swagger-ui/index.html) (dopo avvio del backend)

---

## 🛠️ Installazione e avvio del progetto

### Requisiti
- [Node.js](https://nodejs.org/) (v18+)
- [Java JDK 21](https://adoptium.net/)
- [PostgreSQL](https://www.postgresql.org/) (database già configurato)
- [Maven](https://maven.apache.org/)
- Un IDE (es. IntelliJ, VSCode)

### 🔧 Backend
1. Vai nella cartella `gestione.scuola`
2. Crea un file `.env` oppure imposta le variabili d’ambiente per:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
3. Compila e avvia l'app con:

```bash
mvn spring-boot:run
```

L'app sarà disponibile su `http://localhost:8080`.

### 💻 Frontend
1. Vai nella cartella `frontend`
2. Installa le dipendenze:

```bash
npm install
```

3. Avvia l'app:

```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`.

---

## 📈 Prossimi sviluppi
- Completamento del deploy
- Miglioramento interfaccia grafica (palette personalizzata)
- Aggiunta notifiche e filtri avanzati
- Calendario mensile corsi e ore

---

## 👤 Autore
Progetto sviluppato da **Niccolò Albanese** come parte del progetto finale del bootcamp *Epicode Web Developer*.

---

## 📄 License
Questo progetto è open-source. Sentiti libero di forkare o aprire pull request per contribuire!

---

> Se ti è utile, lascia una ⭐ nel repository!
