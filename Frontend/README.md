# Orvix AI

## Run locally

1. Copy `Backend/.env.example` to `Backend/.env` and set `MONGO_URI`,
   `JWT_SECRET`, and `GROQ_API_KEY`. Start the backend:

   ```sh
   cd Backend
   cp -n .env.example .env
   npm install
   npm run dev
   ```

2. Copy `.env.example` to `.env` if you need to configure the frontend API URL
   (the default is `http://localhost:8080/api`), then start Vite:

   ```sh
   cd Frontend
   cp -n .env.example .env
   npm install
   npm run dev
   ```

The backend allows the Vite origin at `http://localhost:5173` by default.
Set `CLIENT_URL` in `Backend/.env` if the frontend runs at a different origin.
Authentication uses an HTTP-only cookie, so frontend and backend requests must
remain credentialed. Conversation history is private to the signed-in account,
and the account menu's **Log out** action clears the session cookie.
