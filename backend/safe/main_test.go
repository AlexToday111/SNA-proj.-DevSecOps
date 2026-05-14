package main

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHealthEndpoint(t *testing.T) {
	response := performRequest(http.MethodGet, "/health", "")

	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, response.Code)
	}

	var payload healthResponse
	decodeResponse(t, response, &payload)

	if payload.Status != "ok" {
		t.Fatalf("expected status ok, got %q", payload.Status)
	}
	if payload.Service != serviceName {
		t.Fatalf("expected service %q, got %q", serviceName, payload.Service)
	}
}

func TestStatusEndpoint(t *testing.T) {
	response := performRequest(http.MethodGet, "/api/status", "")

	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, response.Code)
	}

	var payload statusResponse
	decodeResponse(t, response, &payload)

	if payload.Mode != "safe" {
		t.Fatalf("expected safe mode, got %q", payload.Mode)
	}
	if payload.Version == "" {
		t.Fatal("expected non-empty version")
	}
}

func TestTokenEndpointUsesRandomURLSafeTokens(t *testing.T) {
	first := requestToken(t)
	second := requestToken(t)

	if first == "" || second == "" {
		t.Fatal("expected non-empty tokens")
	}
	if first == second {
		t.Fatal("expected two independently generated tokens")
	}

	if _, err := base64.RawURLEncoding.DecodeString(first); err != nil {
		t.Fatalf("expected URL-safe base64 token, got %q: %v", first, err)
	}
}

func TestEchoEndpointReturnsInputWithoutExecutingIt(t *testing.T) {
	body := `{"message":"echo should-not-run && uname -a"}`
	response := performRequest(http.MethodPost, "/echo", body)

	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, response.Code)
	}

	var payload echoResponse
	decodeResponse(t, response, &payload)

	if payload.Message != "echo should-not-run && uname -a" {
		t.Fatalf("expected echoed message, got %q", payload.Message)
	}
	if payload.Length != len(payload.Message) {
		t.Fatalf("expected length %d, got %d", len(payload.Message), payload.Length)
	}
}

func TestEchoEndpointRejectsInvalidPayload(t *testing.T) {
	response := performRequest(http.MethodPost, "/echo", `{"message":""}`)

	if response.Code != http.StatusBadRequest {
		t.Fatalf("expected status %d, got %d", http.StatusBadRequest, response.Code)
	}
}

func requestToken(t *testing.T) string {
	t.Helper()

	response := performRequest(http.MethodGet, "/token", "")
	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, response.Code)
	}

	var payload tokenResponse
	decodeResponse(t, response, &payload)

	return payload.Token
}

func performRequest(method, target, body string) *httptest.ResponseRecorder {
	request := httptest.NewRequest(method, target, strings.NewReader(body))
	if body != "" {
		request.Header.Set("Content-Type", "application/json")
	}

	response := httptest.NewRecorder()
	newRouter().ServeHTTP(response, request)

	return response
}

func decodeResponse(t *testing.T, response *httptest.ResponseRecorder, target any) {
	t.Helper()

	if contentType := response.Header().Get("Content-Type"); contentType != "application/json" {
		t.Fatalf("expected application/json content type, got %q", contentType)
	}

	if err := json.NewDecoder(response.Body).Decode(target); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
}
