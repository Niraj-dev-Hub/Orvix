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

2. Configure the frontend API URL if needed (the default is
   `http://localhost:8080/api`), then start Vite:

   ```sh
   cd Frontend
   cp -n .env.example .env
   npm install
   npm run dev
   ```

The backend allows the Vite origin at `http://localhost:5173` by default.
Set `CLIENT_URL` if the frontend runs at a different origin. Authentication
uses an HTTP-only cookie, so frontend and backend requests must remain
credentialed.

## Production deployment

Deploy the backend and frontend as separate services, or serve the frontend
behind the backend's domain. Use Node.js 20.19+ or 22.12+ to build the frontend.

Configure these backend environment variables in the hosting service:

- `MONGO_URI`: production MongoDB connection string. Allow the backend host in
  the database network access rules.
- `JWT_SECRET`: a private random value of at least 32 characters.
- `GEMINI_API_KEY`: a valid Google Gemini API key.
- `NODE_ENV=production`
- `CLIENT_URL`: the exact HTTPS origin serving the frontend, without a path.
- `PORT`: set this only if the host does not provide it automatically.

Configure `VITE_API_URL` in the frontend build environment to the public API
base URL, including `/api` (for example, `https://api.example.com/api`). Vite
embeds this value at build time, so rebuild after changing it. Publish the
contents of `Frontend/dist` after running:

```sh
cd Frontend
npm ci
npm run lint
npm run build
```

Install and start the backend with:

```sh
cd Backend
npm ci
npm test
npm start
```

The API exposes `GET /health` as a readiness check; it returns HTTP 200 only
when MongoDB is connected. The service waits for MongoDB before listening and
exits with an error if required configuration or the database connection is
unavailable. Use HTTPS for both services so secure authentication cookies work.
If the frontend and API are on unrelated sites, browsers may block
cross-site cookies; hosting them on the same site (for example, sibling
subdomains) avoids relying on third-party cookie support.

Conversation history is private to the signed-in account, and the account
menu's **Log out** action clears the session cookie.
