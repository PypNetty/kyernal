package proxmox

import (
	"fmt"
	"testing"

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
