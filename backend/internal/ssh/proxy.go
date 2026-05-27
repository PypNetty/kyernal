package ssh

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
	gossh "golang.org/x/crypto/ssh"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type PTYSession struct {
	sshClient  *gossh.Client
	sshSession *gossh.Session
	stdin      io.WriteCloser
	stdout     io.Reader
}

func loadKey(path string) (gossh.AuthMethod, error) {
	key, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	signer, err := gossh.ParsePrivateKey(key)
	if err != nil {
		return nil, err
	}
	return gossh.PublicKeys(signer), nil
}

func NewPTYSession(vmHost, user, _ string) (*PTYSession, error) {
	bastionAddr := os.Getenv("PROXMOX_BASTION")
	bastionUser := os.Getenv("PROXMOX_BASTION_USER")
	keyPath := os.Getenv("SSH_KEY_PATH")

	if keyPath == "" {
		home, _ := os.UserHomeDir()
		keyPath = home + "/.ssh/id_ed25519"
	}

	log.Printf("[SSH] Connecting to %s via bastion %s as %s", vmHost, bastionAddr, user)

	keyAuth, err := loadKey(keyPath)
	if err != nil {
		return nil, fmt.Errorf("load key failed: %w", err)
	}

	var client *gossh.Client

	if bastionAddr != "" && bastionUser != "" {
		bastionConfig := &gossh.ClientConfig{
			User:            bastionUser,
			Auth:            []gossh.AuthMethod{keyAuth},
			HostKeyCallback: gossh.InsecureIgnoreHostKey(),
			Timeout:         10 * time.Second,
		}

		bastion, err := gossh.Dial("tcp", bastionAddr, bastionConfig)
		if err != nil {
			return nil, fmt.Errorf("bastion dial failed: %w", err)
		}

		conn, err := bastion.Dial("tcp", fmt.Sprintf("%s:22", vmHost))
		if err != nil {
			bastion.Close()
			return nil, fmt.Errorf("vm dial via bastion failed: %w", err)
		}

		vmConfig := &gossh.ClientConfig{
			User:            user,
			Auth:            []gossh.AuthMethod{keyAuth},
			HostKeyCallback: gossh.InsecureIgnoreHostKey(),
			Timeout:         10 * time.Second,
		}

		ncc, chans, reqs, err := gossh.NewClientConn(conn, vmHost, vmConfig)
		if err != nil {
			return nil, fmt.Errorf("vm ssh conn failed: %w", err)
		}
		client = gossh.NewClient(ncc, chans, reqs)

	} else {
		vmConfig := &gossh.ClientConfig{
			User:            user,
			Auth:            []gossh.AuthMethod{keyAuth},
			HostKeyCallback: gossh.InsecureIgnoreHostKey(),
			Timeout:         10 * time.Second,
		}
		client, err = gossh.Dial("tcp", fmt.Sprintf("%s:22", vmHost), vmConfig)
		if err != nil {
			return nil, fmt.Errorf("ssh dial failed: %w", err)
		}
	}

	session, err := client.NewSession()
	if err != nil {
		client.Close()
		return nil, fmt.Errorf("ssh session failed: %w", err)
	}

	modes := gossh.TerminalModes{
		gossh.ECHO:          1,
		gossh.TTY_OP_ISPEED: 14400,
		gossh.TTY_OP_OSPEED: 14400,
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

func HandlePTY(w http.ResponseWriter, r *http.Request) {
	vmHost := r.URL.Query().Get("host")
	if vmHost == "" {
		http.Error(w, "host manquant", http.StatusBadRequest)
		return
	}

	user := os.Getenv("VM_SSH_USER")
	if user == "" {
		user = "apprenant"
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("[PTY] WebSocket upgrade failed: %v", err)
		return
	}
	defer ws.Close()

	pty, err := NewPTYSession(vmHost, user, "")
	if err != nil {
		errorMsg := fmt.Sprintf("Erreur SSH: %v", err)
		log.Printf("[PTY] %s", errorMsg)
		ws.WriteMessage(websocket.TextMessage, []byte(errorMsg))
		return
	}
	defer pty.Close()

	go func() {
		buf := make([]byte, 4096)
		for {
			n, err := pty.stdout.Read(buf)
			if err != nil {
				log.Printf("[PTY] stdout fermé: %v", err)
				break
			}
			if err := ws.WriteMessage(websocket.BinaryMessage, buf[:n]); err != nil {
				log.Printf("[PTY] Échec envoi WebSocket: %v", err)
				break
			}
		}
	}()

	for {
		_, data, err := ws.ReadMessage()
		if err != nil {
			log.Printf("[PTY] WebSocket fermée: %v", err)
			break
		}
		if _, err := pty.stdin.Write(data); err != nil {
			log.Printf("[PTY] stdin fermé: %v", err)
			break
		}
	}
}
