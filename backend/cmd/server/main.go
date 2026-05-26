package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	sshproxy "github.com/PypNetty/klixy/internal/ssh"
)

func main() {
	godotenv.Load(".env")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Route PTY — flux binaire WebSocket → SSH
	http.HandleFunc("/ws/pty", sshproxy.HandlePTY)

	// Health check
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"status":"ok"}`)
	})

	log.Printf("Klixy backend démarré sur :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
