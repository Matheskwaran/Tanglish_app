# Tanglish App – TODO

## Completed
- Repo inspection (server + client voice code)
- Patch `server/server.js` to make MongoDB connection configurable via environment variable (MONGODB_URI) while keeping fallback to `mongodb://localhost:27017/tanglish_db`.
- Add clear startup logging for the resolved MongoDB URI (without credentials).
- Start backend (`node server/server.js`) and confirm Mongo connection succeeds.
- Serve static frontend files from the backend Express server, enabling access from both desktop and mobile devices.
- Relocate the `html` directory from `js/html` to the project root so references like `html/login.html` and assets relative paths (`../css/...`, `../js/...`) resolve correctly.

## Next



