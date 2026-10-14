# Orvix AI

## Run locally

1. Copy `Backend/.env.example` to `Backend/.env` and set `MONGO_URI`,
   `JWT_SECRET` (at least 32 characters), and `GEMINI_API_KEY`. Start the API:

   ```sh
   cd Backend
   cp -n .env.example .env
   npm install
   npm run dev
   ```

2. Start the frontend:

   ```sh
   cd Frontend
   npm install
   npm run dev
   ```

The Vite development server proxies `/api` requests to `http://localhost:8080`.
The backend allows the Vite origin at `http://localhost:5173` by default.
Authentication uses an HTTP-only cookie.

## Production deployment

Deploy the backend on Render and the frontend on Vercel. Use Node.js 20.19+ or
22.12+ to build the frontend.

Configure these backend environment variables in Render:

- `MONGO_URI`: production MongoDB connection string. Allow the backend host in
  the database network access rules.
- `JWT_SECRET`: a private random value of at least 32 characters.
- `GEMINI_API_KEY`: a valid Google Gemini API key.
- `GROQ_API_KEY`: a valid Groq API key.
- `GEMINI_MODEL` (optional): Gemini model name; defaults to `gemini-3.1-flash-lite`.
- `GROQ_MODEL` (optional): Groq model name; defaults to `openai/gpt-oss-20b`.
- `NODE_ENV=production`
- `CLIENT_URL`: `https://orvix-sigma.vercel.app` (the exact HTTPS frontend
  origin, without a trailing slash or path).
- `PORT`: set this only if Render does not provide it automatically.

The Vercel project uses `Frontend` as its root directory, with build command
`npm ci && npm run build` and output directory `dist`. The checked-in
`vercel.json` proxies `/api/*` requests to the Render API, so browser requests
and authentication cookies use the Vercel site origin instead of relying on
cross-site cookies.

The frontend always sends API requests to the same-origin `/api` path, which
Vercel proxies to Render. Do not configure a separate API URL; keeping requests
same-origin allows authentication cookies to work in browsers that restrict
cross-site cookies.

Install and test the backend with:

```sh
cd Backend
npm ci
npm test
npm start
```

The API exposes `GET /health` as a readiness check; it returns HTTP 200 only
when MongoDB is connected. The service waits for MongoDB before listening and
exits with an error if required configuration or the database connection is
unavailable. Use HTTPS for both services.

Conversation history is private to the signed-in account, and the account
menu's **Log out** action clears the session cookie.

Choose **Gemini** or **Groq** from the model selector below the message box;
provider API keys stay on the backend and are never sent to the browser.
