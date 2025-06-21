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

## Technologieën

- **Frontend**:
  - React
  - Handmatige styling met CSS
  - Componentgebaseerde structuur (`components/`, `pages/`, `hooks/`, `context/`)
- **Backend**: 
  - Node.js
  - Express.js
  - MySQL (database)
  - Eigen routing (`routes/`) en middleware (`middleware/`)
  - Environment-variabelen via `.env`
- **Versiebeheer**: 
  - Git & GitHub

## Backend
1. Navigeer naar de backend-map:
   ```bash
   cd backend

2. Installeer dependencies:
   ```bash
   npm install

3. Voeg een .env bestand toe met de volgende variabelen:
   ```bash
   DB_HOST=10.2.160.211
   DB_USER=groep13
   DB_PASS=aijQ8ZSp
   DB_NAME=careerlaunch
   DB_PORT=3306

4. Start de server:
   ```bash
   node server.j


## Frontend

1. Navigeer naar de programingproject-map:
   ```bash
   cd programingproject

2. Installeer dependencies:
   ```bash
   npm install

3. Maak een .env bestand aan in de programingproject/-map met volgende inhoud:
   ```bash
   VITE_API_BASE_URL=http://10.2.160.211:3000/api

4. Start de applicatie: 
   ```bash
   npm run dev

## Aanpak

Om ons project gestructureerd aan te pakken, hebben we cursussen gevolgd over:

- **Agile werken**
- **Design Thinking**

via LinkedIn Learning.

## Gebruikte bronnen

- **Career Launch Dag**
- LinkedIn Learning – Agile Foundations
- LinkedIn Learning – Design Thinking
