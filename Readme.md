# BloomKV: Username Availability Checker

A high-performance, real-time username availability checker. This project demonstrates how to use a custom-built, in-memory **Bloom Filter** to validate usernames probabilistically in milliseconds without hitting a traditional database.

## System Architecture

This project is split into two distinct services:
* **API (Backend):** A highly concurrent Go server implementing a thread-safe Bloom Filter using three hashing algorithms (FNV-1a, MurmurHash3, and CRC-64 ECMA).
* **Client (Frontend):** A modern React application featuring real-time, as-you-type validation with built-in debouncing, character/length checks, and API preflight handling.

---

## Backend (Go API)

The API is built using Go's standard library (Go 1.22+ routing) and is entirely self-contained. It holds 960 bits of probabilistic data in memory, protected by read/write mutexes to guarantee thread safety across concurrent HTTP requests.

### Tech Stack
* **Language:** Go (1.22+)
* **Hashing Algorithms:** FNV-1a, MurmurHash3, CRC-64 ECMA
* **Core Logic:** Bitwise operations on `uint64` slices with `sync.RWMutex`

### Setup & Run

1. Navigate to the API directory:
```bash
cd api
```

2. Download the required dependencies:
```bash
go mod tidy
```

3. Start the server (runs on `http://localhost:8000`):
```bash
go run cmd/server/main.go
```

### Endpoints
* `GET /seed?count=10` — Initializes the Bloom filter (if uninitialized) and populates it with dummy 8-character UUID usernames. Returns the generated usernames for quick testing.
* `POST /search` — Accepts `{"username": "example"}` in the request body and returns `{"exists": true/false}`.

---

## Frontend (Client)

The `bloomkv` client is a fast user interface built with the modern React ecosystem. It validates username constraints locally before dispatching debounced requests to the Go backend.

### Tech Stack
* **Core Framework:** React 19
* **Full-Stack Framework:** TanStack Start (SSR / file-based routing)
* **Routing:** TanStack Router
* **State Management & Caching:** TanStack React Query
* **Build Tool:** Vite

### Setup & Run

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server (runs on `http://localhost:8080`):
```bash
npm run dev
```

---

## Local Testing Workflow

1. Start both servers: Ensure the Go API (`:8000`) and the React Client (`:8080`) are running in separate terminal sessions.
2. Seed the filter: Open `http://localhost:8000/seed?count=10` in your browser. Copy one of the generated 8-character strings from the response.
3. Open the UI: Go to `http://localhost:8080`.
4. Test live validation:
   * Enter a short name (< 6 chars) to trigger the minimum length check.
   * Add special characters (e.g., `user_name!`) to trigger the alphanumeric validation.
   * Enter a random valid string to see the `Username available` state.
   * Paste the copied seeded username to see the `Username not available` state returned from the Bloom filter.