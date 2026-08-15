package main

import (
	"log"
	"net/http"

	"api/internal/handlers"
)

// corsMiddleware intercepts requests to handle browser preflight checks
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set headers to allow your React app to communicate with this server
		w.Header().Set("Access-Control-Allow-Origin", "*") // Allows all origins
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		// If it's an OPTIONS preflight request, stop here and return 200 OK
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Otherwise, pass the request down to our actual handler
		next.ServeHTTP(w, r)
	})
}

func main() {
	srv := handlers.NewServer()

	mux := http.NewServeMux()
	srv.RegisterRoutes(mux)

	handler := corsMiddleware(mux)

	port := ":8000"
	log.Printf("Starting Bloom Filter API on %s...\n", port)

	if err := http.ListenAndServe(port, handler); err != nil {
		log.Fatalf("Server crashed: %v", err)
	}
}
