package proxmox

import (
	"fmt"
	"testing"
	"time"

	"github.com/joho/godotenv"
)

func TestVersion(t *testing.T) {
	godotenv.Load("../../.env")
	c := NewClient()
	version, err := c.Version()
	if err != nil {
		t.Fatalf("failed to get version: %v", err)
	}
	fmt.Printf("Proxmox version: %v\n", version)
}

func TestCloneVM(t *testing.T) {
	godotenv.Load("../../.env")
	c := NewClient()
	taskID, err := c.CloneVM(200, "test-klixy-poc")
	if err != nil {
		t.Fatalf("failed to clone VM: %v", err)
	}
	t.Logf("Clone task: %s", taskID)
}

func TestStartVM(t *testing.T) {
	godotenv.Load("../../.env")
	c := NewClient()
	err := c.StartVM(200)
	if err != nil {
		t.Fatalf("failed to start VM: %v", err)
	}
	t.Log("VM 200 started")
}

func TestGetVMIP(t *testing.T) {
	godotenv.Load("../../.env")
	c := NewClient()
	time.Sleep(30 * time.Second)
	ip, err := c.GetVMIP(200)
	if err != nil {
		t.Fatalf("failed to get VM IP: %v", err)
	}
	t.Logf("VM 200 IP: %s", ip)
}

func TestDeleteVM(t *testing.T) {
	godotenv.Load("../../.env")
	c := NewClient()

	// Force stop avec la méthode Request mise à jour
	c.Request("POST", fmt.Sprintf("/nodes/%s/qemu/200/status/stop", c.node), map[string]any{"forceStop": 1})

	// Attendre l'arrêt complet
	time.Sleep(5 * time.Second)

	err := c.DeleteVM(200)
	if err != nil {
		t.Fatalf("failed to delete VM: %v", err)
	}
	t.Log("VM 200 deleted")
}
