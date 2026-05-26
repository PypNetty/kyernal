package ssh

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
	"golang.org/x/crypto/ssh"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type PTYSession struct {
	sshClient  *ssh.Client
	sshSession *ssh.Session
	stdin      io.WriteCloser
	stdout     io.Reader
}

func NewPTYSession(host, user, password string) (*PTYSession, error) {
	config := &ssh.ClientConfig{
		User: user,
		Auth: []ssh.AuthMethod{
			ssh.Password(password),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
		Timeout:         10 * time.Second,
	}

	client, err := ssh.Dial("tcp", fmt.Sprintf("%s:22", host), config)
	if err != nil {
		return nil, fmt.Errorf("ssh dial failed: %w", err)
	}

	session, err := client.NewSession()
	if err != nil {
		client.Close()
		return nil, fmt.Errorf("ssh session failed: %w", err)
	}

	modes := ssh.TerminalModes{
		ssh.ECHO:          1,
		ssh.TTY_OP_ISPEED: 14400,
		ssh.TTY_OP_OSPEED: 14400,
	}

	if err := session.RequestPty("xterm-256color", 40, 120, modes); err != nil {
		session.Close()
		client.Close()
		return nil, fmt.Errorf("pty request failed: %w", err)
	}

	stdin, err := session.StdinPipe()
	if err != nil {
		session.Close()
		client.Close()
		return nil, fmt.Errorf("stdin pipe failed: %w", err)
	}

	stdout, err := session.StdoutPipe()
	if err != nil {
		session.Close()
		client.Close()
		return nil, fmt.Errorf("stdout pipe failed: %w", err)
	}

	if err := session.Shell(); err != nil {
		session.Close()
		client.Close()
		return nil, fmt.Errorf("shell failed: %w", err)
	}

	return &PTYSession{
		sshClient:  client,
		sshSession: session,
		stdin:      stdin,
		stdout:     stdout,
	}, nil
}

func (p *PTYSession) Close() {
	p.sshSession.Close()
	p.sshClient.Close()
}

// HandlePTY gère le WebSocket /ws/pty/{id}
// Flux binaire pur : navigateur → stdin SSH, stdout SSH → navigateur
func HandlePTY(w http.ResponseWriter, r *http.Request) {
	vmHost := r.URL.Query().Get("host")
	if vmHost == "" {
		http.Error(w, "missing host", http.StatusBadRequest)
		return
	}

	user := os.Getenv("VM_SSH_USER")
	password := os.Getenv("VM_SSH_PASSWORD")
	if user == "" {
		user = "apprenant"
	}
	if password == "" {
		password = "motdepasse"
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer ws.Close()

	pty, err := NewPTYSession(vmHost, user, password)
	if err != nil {
		ws.WriteMessage(websocket.TextMessage, []byte("Connexion SSH échouée: "+err.Error()))
		return
	}
	defer pty.Close()

	// stdout SSH → WebSocket
	go func() {
		buf := make([]byte, 4096)
		for {
			n, err := pty.stdout.Read(buf)
			if err != nil {
				return
			}
			if err := ws.WriteMessage(websocket.BinaryMessage, buf[:n]); err != nil {
				return
			}
		}
	}()

	// WebSocket → stdin SSH
	for {
		_, data, err := ws.ReadMessage()
		if err != nil {
			return
		}
		if _, err := pty.stdin.Write(data); err != nil {
			return
		}
	}
}
