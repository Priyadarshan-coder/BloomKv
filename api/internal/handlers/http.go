package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"sync"

	"api/internal/bloom"

	"github.com/google/uuid"
)

// Server holds the dependencies for the HTTP handlers.
type Server struct {
	filter *bloom.Filter
	mu     sync.RWMutex
}

// NewServer creates a new HTTP server instance.
func NewServer() *Server {
	return &Server{}
}

// RegisterRoutes attaches the handlers to the given multiplexer.
func (s *Server) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /search", s.handleSearch)
	mux.HandleFunc("GET /seed", s.handleSeed)
}

func (s *Server) handleSearch(w http.ResponseWriter, r *http.Request) {
	s.mu.Lock()
	if s.filter == nil {
		s.filter = bloom.New(15)
	}
	f := s.filter
	s.mu.Unlock()

	var req struct {
		Username string `json:"username"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Username == "" {
		http.Error(w, "Invalid JSON or missing 'username'", http.StatusBadRequest)
		return
	}

	exists := f.Check(req.Username)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"exists": exists})
}

func (s *Server) handleSeed(w http.ResponseWriter, r *http.Request) {
	s.mu.RLock()
	f := s.filter
	s.mu.RUnlock()

	if f == nil {
		http.Error(w, "Bloom filter not initialized. Call /search first.", http.StatusServiceUnavailable)
		return
	}

	// Default to generating 10 items so the JSON response isn't too massive by default
	count := 10
	if countParam := r.URL.Query().Get("count"); countParam != "" {
		if parsed, err := strconv.Atoi(countParam); err == nil && parsed > 0 {
			count = parsed
		}
	}

	// Create a slice to hold all the generated 8-character usernames
	var generatedUsernames []string

	for i := 0; i < count; i++ {
		// Generate a UUID and slice it to take only the first 8 characters
		newUsername := uuid.New().String()[:8]

		f.Add(newUsername)
		generatedUsernames = append(generatedUsernames, newUsername)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"message":     "Successfully seeded Bloom filter",
		"items_added": count,
		"usernames":   generatedUsernames, // Return the full array to the client
	})
}
