package main

import (
	"fmt"
	"log"
	"net/http"
)

func handlehealth(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Server is healthy and running")
}
func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", handlehealth)
	port := ":8080"
	log.Printf("Starting server on port %s", port)
	err := http.ListenAndServe(port, mux)
	if err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
