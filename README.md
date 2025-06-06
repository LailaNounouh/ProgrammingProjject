# ProgrammingProjject - Quick Install & Run Guide
==============================================

Volg deze stappen om het project lokaal op te zetten en de website te bekijken.

---

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
