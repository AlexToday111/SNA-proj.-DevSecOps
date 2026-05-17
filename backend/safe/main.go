package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"time"
)

const (
	serviceName  = "devsecops-safe-backend"
	version      = "1.0.0"
	defaultAddr  = ":8080"
	maxEchoBytes = 4096
)

type app struct {
	startedAt time.Time
}

type healthResponse struct {
	Status  string `json:"status"`
	Service string `json:"service"`
}

type statusResponse struct {
	Service       string `json:"service"`
	Version       string `json:"version"`
	Mode          string `json:"mode"`
	UptimeSeconds int64  `json:"uptime_seconds"`
}

type tokenResponse struct {
	Token string `json:"token"`
}

type echoRequest struct {
	Message string `json:"message"`
}

type echoResponse struct {
	Message string `json:"message"`
	Length  int    `json:"length"`
}

type errorResponse struct {
	Error string `json:"error"`
}

func main() {
	addr := os.Getenv("APP_ADDR")
	if addr == "" {
		addr = defaultAddr
	}

	server := &http.Server{
		Addr:              addr,
		Handler:           newRouter(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("starting %s", serviceName)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("server failed: %v", err)
	}
}

func newRouter() http.Handler {
	a := app{startedAt: time.Now().UTC()}
	mux := http.NewServeMux()

	mux.HandleFunc("GET /health", a.handleHealth)
	mux.HandleFunc("GET /api/status", a.handleStatus)
	mux.HandleFunc("GET /token", a.handleToken)
	mux.HandleFunc("POST /echo", a.handleEcho)

	return mux
}

func (a app) handleHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, healthResponse{
		Status:  "ok",
		Service: serviceName,
	})
}

func (a app) handleStatus(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, statusResponse{
		Service:       serviceName,
		Version:       version,
		Mode:          "safe",
		UptimeSeconds: int64(time.Since(a.startedAt).Seconds()),
	})
}

func (a app) handleToken(w http.ResponseWriter, _ *http.Request) {
	token, err := secureToken(32)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, errorResponse{Error: "failed to generate token"})
		return
	}

	writeJSON(w, http.StatusOK, tokenResponse{Token: token})
}

func (a app) handleEcho(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if err := r.Body.Close(); err != nil {
			log.Printf("failed to close request body: %v", err)
		}
	}()

	limitedBody := http.MaxBytesReader(w, r.Body, maxEchoBytes)
	decoder := json.NewDecoder(limitedBody)
	decoder.DisallowUnknownFields()

	var request echoRequest
	if err := decoder.Decode(&request); err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: "invalid JSON payload"})
		return
	}

	if request.Message == "" {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: "message is required"})
		return
	}

	writeJSON(w, http.StatusOK, echoResponse{
		Message: request.Message,
		Length:  len(request.Message),
	})
}

func secureToken(size int) (string, error) {
	bytes := make([]byte, size)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}

	return base64.RawURLEncoding.EncodeToString(bytes), nil
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	body, err := json.Marshal(payload)
	if err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if _, err := w.Write(append(body, '\n')); err != nil {
		log.Printf("failed to write response: %v", err)
	}
}
