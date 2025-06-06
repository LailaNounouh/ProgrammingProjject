# ProgrammingProjject - Quick Install & Run Guide
==============================================

Volg deze stappen om het project lokaal op te zetten en de website te bekijken.

---
Introductie

Deze handleiding helpt je bij het lokaal opzetten van het ProgrammingProjject. We besteden extra aandacht aan de backend en database configuratie om veelvoorkomende problemen te voorkomen.

Vereisten

Zorg dat je de volgende software hebt geïnstalleerd:

•
Node.js (v14 of hoger)

•
npm (v6 of hoger)

•
MySQL (v8.0 aanbevolen)

•
Git

Project Clonen

Open een terminal en voer de volgende commando's uit om het project te clonen:

Bash


git clone https://github.com/LailaNounouh/ProgrammingProjject.git
cd ProgrammingProjject


Backend Setup

Dependencies Installeren

Navigeer naar de backend map:

Bash


cd backend


Installeer alle benodigde dependencies:

Bash


npm install


Database Configuratie

MySQL Installeren

Als je MySQL nog niet hebt geïnstalleerd, volg dan deze stappen:

Voor Windows:

1.
Download de MySQL Installer van de officiële website

2.
Voer de installer uit en volg de instructies

3.
Kies "Developer Default" tijdens de installatie

4.
Stel een root wachtwoord in (onthoud dit goed!)

5.
Voltooi de installatie

Voor macOS:

1.
Installeer MySQL via Homebrew:

2.
Start de MySQL service:

3.
Stel een root wachtwoord in:

Voor Linux (Ubuntu/Debian):

1.
Update je pakketlijst:

2.
Installeer MySQL:

3.
Configureer de beveiliging:

Database Aanmaken

Je kunt de database op twee manieren aanmaken:

Via Command Line:

1.
Log in op MySQL:

2.
Maak een nieuwe database aan:

3.
Maak een nieuwe gebruiker aan en geef rechten (aanbevolen in plaats van root te gebruiken):

4.
Verlaat MySQL:

Via GUI Tools:

Als je liever een grafische interface gebruikt, kun je tools zoals:

•
MySQL Workbench

•
phpMyAdmin

•
HeidiSQL (Windows)

•
Sequel Pro (macOS)

Gebruik deze tools om:

1.
Een nieuwe database aan te maken genaamd programmingprojject

2.
Een nieuwe gebruiker aan te maken met alle rechten op deze database

Schema Importeren

Als het project een SQL schema bevat, importeer dit dan:

1.
Controleer of er een schema.sql bestand bestaat in de backend map of in een submap zoals database of sql

2.
Importeer het schema via command line:

3.
Als er geen schema.sql bestand is, controleer dan of er migratie scripts zijn in de backend code (vaak in een map genaamd migrations of db).

Omgevingsvariabelen (.env) Configureren

Een van de meest voorkomende problemen is het ontbreken van een correct geconfigureerd .env bestand. Volg deze stappen:

1.
Maak een nieuw bestand aan in de backend map genaamd .env:

2.
Open het bestand in een teksteditor:

3.
Voeg de volgende variabelen toe aan het bestand:

4.
Sla het bestand op en sluit de editor.

5.
Zorg ervoor dat het .env bestand is toegevoegd aan .gitignore om te voorkomen dat gevoelige informatie wordt gedeeld:

Backend Starten

Nu je de database en omgevingsvariabelen hebt geconfigureerd, kun je de backend starten:

Bash


npm run start


Als je een specifiek startscript hebt, gebruik dan dat commando. Bijvoorbeeld:

Bash


node server.js


of

Bash


nodemon server.js


Controleer of de server succesvol is gestart. Je zou een bericht moeten zien zoals:

Plain Text


Server running on port 3000
Connected to database successfully


De backend draait nu op: http://localhost:3000

Veelvoorkomende Backend Problemen

Probleem: Kan niet verbinden met de database

•
Controleer of MySQL draait: sudo service mysql status (Linux) of brew services list (macOS)

•
Controleer je .env configuratie en zorg dat de gegevens correct zijn

•
Controleer of de database bestaat: mysql -u root -p -e "SHOW DATABASES;"

•
Controleer of de gebruiker de juiste rechten heeft: mysql -u root -p -e "SHOW GRANTS FOR 'projectuser'@'localhost';"

Probleem: "Module not found" fouten

•
Controleer of alle dependencies zijn geïnstalleerd: npm install

•
Controleer of je in de juiste map bent

Probleem: Port already in use

•
Wijzig de poort in het .env bestand of stop het proces dat de poort gebruikt

•
Vind het proces: lsof -i :3000 (macOS/Linux) of netstat -ano | findstr :3000 (Windows)

Probleem: .env bestand wordt niet geladen

•
Controleer of je de dotenv package hebt geïnstalleerd: npm install dotenv

•
Zorg dat je .env vroeg in je code laadt:

Frontend Setup

Frontend Dependencies Installeren

Open een nieuwe terminal en navigeer naar de frontend map:

Bash


cd frontend


Installeer alle benodigde dependencies:

Bash


npm install


Frontend Starten

Start de frontend development server:

Bash


npm run dev


Als je een ander startcommando gebruikt (bijvoorbeeld voor Create React App):

Bash


npm start


De frontend draait nu op: http://localhost:5173 (voor Vite) of http://localhost:3000 (voor Create React App)

Website Bekijken

Open je browser en ga naar:

•
Frontend: http://localhost:5173 (of de poort die in je terminal wordt weergegeven)

•
Backend API: http://localhost:3000

Veelgestelde Vragen (FAQ)

V: Hoe weet ik of mijn database correct is geconfigureerd?
A: Voer een test API call uit naar een endpoint dat database toegang vereist, bijvoorbeeld:

Bash


curl http://localhost:3000/api/test


V: Wat moet ik doen als ik de foutmelding "ER_ACCESS_DENIED_ERROR" krijg?
A: Dit betekent dat je database gebruikersnaam of wachtwoord onjuist is. Controleer je .env bestand en zorg dat de gegevens overeenkomen met wat je hebt ingesteld in MySQL.

V: Hoe kan ik de database structuur bekijken?
A: Log in op MySQL en gebruik de volgende commando's:

SQL


USE programmingprojject;
SHOW TABLES;
DESCRIBE tabel_naam;


V: Mijn frontend kan geen verbinding maken met de backend, wat nu?
A: Controleer of:

1.
De backend server draait

2.
De API calls in de frontend code de juiste URL gebruiken

3.
CORS is ingeschakeld op de backend

4.
Er geen netwerkfouten zijn in de browser console






1. Project clonen
-----------------
Open een terminal en clone de repository:

git clone https://github.com/LailaNounouh/ProgrammingProjject.git
cd ProgrammingProjject

---

2. Backend installeren
---------------------
Ga naar de backend map (of waar jouw backend server staat):

cd backend

Installeer de benodigde dependencies:

npm install

---

3. Database instellen
--------------------
- Zorg dat MySQL draait en maak een nieuwe database aan, bijvoorbeeld `programmingprojject`.

- Importeer het SQL schema (als je een `.sql` bestand hebt):

mysql -u jouw_gebruikersnaam -p programmingprojject < schema.sql

- Pas de database connectie aan in `db.js` of het bestand waar de connectie staat:

const pool = mysql.createPool({
  host: 'localhost',
  user: 'jouw_gebruikersnaam',
  password: 'jouw_wachtwoord',
  database: 'programmingprojject',
});

---

4. Backend starten
-----------------
Start de backend server:

npm run start

(of bijvoorbeeld `node server.js` afhankelijk van je setup)

De backend draait nu op: http://localhost:3000

---

5. Frontend installeren
----------------------
Open een nieuwe terminal en ga naar de frontend map (bijv. `frontend` of de map met `package.json` van de frontend):

cd frontend

Installeer de frontend dependencies:

npm install

---

6. Frontend starten
------------------
Start de frontend development server:

npm run dev

(als je Vite gebruikt; anders `npm start`)

De frontend draait nu op: http://localhost:5173

---

7. Website bekijken
------------------
Open je browser en ga naar:

http://localhost:5173

De website zou nu moeten werken en communiceren met de backend op poort 3000.

---

Tips:
-----
- Zorg dat backend en database draaien voordat je de frontend start.
- Controleer of API calls in de frontend de juiste backend URL gebruiken (bijv. http://localhost:3000/api/...).
- Controleer de console op fouten en dat de database connectie correct is.

---

Veel succes en plezier met de Career Launch Day website!

---

# ProgrammingProject – Team 13

Welkom bij het groepswerk van **Team 13**!

## Opdracht

Onze opdracht is het organiseren van een **innovatieve open deurdag** op onze hogeschool. Deze dag is gericht op het verbinden van **studenten/carrièrezoekers** (maar niet alleen hen) met **bedrijven**. 

Tijdens dit event nodigen we verschillende bedrijven uit om op de campus hun organisatie en carrièremogelijkheden te presenteren. Het doel is om potentiële **samenwerkingen** en **stageplaatsen** te stimuleren.

Om deze dag zo vlot en interactief mogelijk te laten verlopen, ontwikkelen wij een **moderne web applicatie**. Deze digitale oplossing:

- helpt bedrijven en studenten eenvoudig met elkaar in contact te komen,
- biedt een duidelijk **overzicht van aanwezige bedrijven en activiteiten**,
- maakt het **plannen van gesprekken** mogelijk.

Zo combineren we een fysiek netwerkevent met de kracht van IT en innovatie.

## Aanpak

Om ons project gestructureerd aan te pakken, hebben we cursussen gevolgd over:

- **Agile werken**
- **Design Thinking**

via LinkedIn Learning.

## Gebruikte bronnen

- **Career Launch Dag**
- LinkedIn Learning – Agile Foundations
- LinkedIn Learning – Design Thinking
