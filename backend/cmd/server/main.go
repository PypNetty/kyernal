package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/PypNetty/klixy/internal/proxmox"
	sshproxy "github.com/PypNetty/klixy/internal/ssh"
	"github.com/joho/godotenv"
)

type SessionResponse struct {
	SessionID string `json:"sessionID"`
	VMIP      string `json:"vmIP"`
	VMID      int    `json:"vmID"`
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

func startArena(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	client := proxmox.NewClient()

	vmID := 300 + rand.Intn(600)
	vmName := fmt.Sprintf("klixy-arena-%d", vmID)

	log.Printf("[Arena] Cloning VM %d (%s)...", vmID, vmName)
	_, err := client.CloneVM(vmID, vmName)
	if err != nil {
		log.Printf("[Arena] Clone failed: %v", err)
		http.Error(w, `{"error":"clone failed"}`, http.StatusInternalServerError)
		return
	}

	// Injecter la clé SSH publique avant de démarrer
	home, _ := os.UserHomeDir()
	if pubKeyBytes, err := os.ReadFile(home + "/.ssh/id_ed25519.pub"); err == nil {
		if err := client.SetSSHKey(vmID, string(pubKeyBytes)); err != nil {
			log.Printf("[Arena] SetSSHKey warning: %v", err)
		} else {
			log.Printf("[Arena] SSH key injected into VM %d", vmID)
		}
	}

	log.Printf("[Arena] Starting VM %d...", vmID)
	if err := client.StartVM(vmID); err != nil {
		log.Printf("[Arena] Start failed: %v", err)
		http.Error(w, `{"error":"start failed"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("[Arena] Waiting for VM %d to boot...", vmID)
	var vmIP string
	for i := 0; i < 12; i++ {
		time.Sleep(10 * time.Second)
		ip, err := client.GetVMIP(vmID)
		if err == nil && ip != "" {
			vmIP = ip
			break
		}
		log.Printf("[Arena] Waiting... attempt %d/12", i+1)
	}

	if vmIP == "" {
		http.Error(w, `{"error":"timeout waiting for VM IP"}`, http.StatusInternalServerError)
		return
	}

	sessionID := fmt.Sprintf("sess_%d_%d", vmID, time.Now().Unix())
	log.Printf("[Arena] VM ready — ID: %d, IP: %s, Session: %s", vmID, vmIP, sessionID)

	json.NewEncoder(w).Encode(SessionResponse{
		SessionID: sessionID,
		VMIP:      vmIP,
		VMID:      vmID,
	})
}

func main() {
	godotenv.Load(".env")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/ws/pty", sshproxy.HandlePTY)
	http.HandleFunc("/arena/start", corsMiddleware(startArena))
	http.HandleFunc("/health", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"status":"ok"}`)
	}))

	log.Printf("Klixy backend démarré sur :%s", port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, nil))
}
