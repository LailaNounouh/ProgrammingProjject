# ProgrammingProjject – Installatie & Gebruikershandleiding

Volg deze stappen om het project lokaal op te zetten en te draaien.

---

## Benodigdheden

- Node.js en npm geïnstalleerd
- MySQL database geïnstalleerd
- Git geïnstalleerd

---

##  Project clonen

Open een terminal en voer uit:

```bash
git clone https://github.com/LailaNounouh/ProgrammingProjject.git
cd ProgrammingProjject
```

---

##  Backend installeren

Navigeer naar de backend-map:

```bash
cd backend
npm install
```

---

##  Database instellen

### MySQL installeren

 
- Download MySQL Installer via de officiële website  
- Kies "Developer Default" tijdens installatie  
- Stel een root-wachtwoord in  
- Zorg dat de MySQL service draait


### Database aanmaken

Log in op MySQL via de terminal:

```bash
mysql -u root -p
```

Voer daarna uit:

```sql
CREATE DATABASE programmingprojject;
EXIT;
```

---

### Database schema importeren

Zorg dat `schema.sql` beschikbaar is. Voer uit:

```bash
mysql -u projectuser -p programmingprojject < pad/naar/schema.sql
```

Indien geen schema aanwezig is, controleer of er migraties bestaan (bv. map `sql bestand`).

---

## 🔐 .env bestand configureren

Maak het `.env` bestand aan in de backend-map:

```bash
touch .env
```

Voeg de volgende inhoud toe:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=projectuser
DB_PASSWORD=jouw_veilige_wachtwoord
DB_NAME=programmingprojject
DB_PORT=3306
```

Voeg het bestand toe aan `.gitignore`:

```bash
echo ".env" >> .gitignore
```

Controleer dat deze variabelen ook correct gebruikt worden in je `db.js` of connectiebestand.

---

##  Backend starten

Start de backend server:

```bash
npm run start
```

(of gebruik `node server.js` indien van toepassing)

Test of de backend draait:

```bash
curl http://localhost:3000/api/test
```

---

## Frontend installeren

Navigeer naar de frontend-map:

```bash
cd frontend
npm install
```

---

## Frontend starten

Start de frontend (bijvoorbeeld via Vite):

```bash
npm run dev
```

Frontend is nu beschikbaar op:  
[http://localhost:5173](http://localhost:5173)

---

## Website bekijken

Open je browser en ga naar:

[http://localhost:5173](http://localhost:5173)

De frontend communiceert met de backend op poort 3000.

---

## Tips & Troubleshooting

- Zorg dat backend en database actief zijn voor je frontend opstart
- Controleer of frontend API calls verwijzen naar `http://localhost:3000`
- Bij `ER_ACCESS_DENIED_ERROR`: check je DB-gegevens in `.env`
- Bij `ER_BAD_DB_ERROR`: check of je database correct aangemaakt is
- Wijzigingen in `.env`? Herstart de backend

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
