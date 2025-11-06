# Meetverse - Backend (API)

Detta är kodbasen för Meetverse API, som hanterar all data, logik och användarautentisering för [Meetverse-frontend](https://github.com/little-mry/meetverse-FE)

Applikationen är byggd i Node.js (Express) och TypeScript. Den använder MongoDB (Mongoose) för datalagring och JWT för att hantera inloggningar. API:et är hostat på Render.

# Tekniker som används

- Grund: Node.js, Express.js

- Språk: TypeScript

- Databas: MongoDB (med Mongoose)

- Autentisering: JSON Web Tokens (JWT) med jose-biblioteket

- Lösenordshantering: bcryptjs för hashning

- Felhantering: Anpassad "middleware" för felhantering

- Hostas på: Render (Web Service)

# Användare (/api/user)

- POST /register: Skapa en ny användare.

- POST /login: Logga in en befintlig användare. Returnerar en JWT.

- GET /me: Hämta den inloggade användarens profil (Skyddad route).

# Meetups (/api/meetups)

- GET /: Hämta en lista på alla meetups.

- GET /:id: Hämta detaljerad information om ett specifikt meetup.

- POST /:id/register: Anmäl den inloggade användaren till ett meetup (Skyddad route).

- DELETE /:id/register: Avanmäl den inloggade användaren från ett meetup (Skyddad route).

- POST /:id/reviews: Lämna en recension (betyg + text) på ett meetup (Skyddad route).

## Grupprojekt med medlemmarna Ludwig, Maria, Vendela, Alice
