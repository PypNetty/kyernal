package proxmox

import (
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"strconv"
	"strings"
)

type CloneRequest struct {
	NewID    int    `json:"newid"`
	Name     string `json:"name"`
	FullCopy int    `json:"full"`
	Storage  string `json:"storage"`
}

type VMInfo struct {
	VMID   int    `json:"vmid"`
	Name   string `json:"name"`
	Status string `json:"status"`
}

func (c *Client) CloneVM(newID int, name string) (string, error) {
	templateID, _ := strconv.Atoi(os.Getenv("PROXMOX_TEMPLATE_ID"))
	storage := os.Getenv("PROXMOX_STORAGE")

	body := CloneRequest{
		NewID:    newID,
		Name:     name,
		FullCopy: 1,
		Storage:  storage,
	}

	path := fmt.Sprintf("/nodes/%s/qemu/%d/clone", c.node, templateID)
	data, err := c.Request("POST", path, body)
	if err != nil {
		return "", err
	}

	var result struct {
		Data string `json:"data"`
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return "", err
	}

	return result.Data, nil
}

// ConfigureCloudInit lie un snippet #cloud-config utilisateur stocké sur l'hyperviseur à la VM cible
func (c *Client) ConfigureCloudInit(vmID int, userSnippetPath string) error {
	path := fmt.Sprintf("/nodes/%s/qemu/%d/config", c.node, vmID)

	body := map[string]string{
		"cicustom":  userSnippetPath,
		"ipconfig0": "ip=dhcp", // Force la carte réseau net0 à demander une IP
	}

	_, err := c.Request("POST", path, body)
	return err
}

func (c *Client) StartVM(vmID int) error {
	path := fmt.Sprintf("/nodes/%s/qemu/%d/status/start", c.node, vmID)
	_, err := c.Request("POST", path, nil)
	return err
}

func (c *Client) StopVM(vmID int) error {
	path := fmt.Sprintf("/nodes/%s/qemu/%d/status/stop", c.node, vmID)
	_, err := c.Request("POST", path, nil)
	return err
}

func (c *Client) DeleteVM(vmID int) error {
	path := fmt.Sprintf("/nodes/%s/qemu/%d", c.node, vmID)
	_, err := c.Request("DELETE", path, nil)
	return err
}

func (c *Client) GetVMStatus(vmID int) (string, error) {
	path := fmt.Sprintf("/nodes/%s/qemu/%d/status/current", c.node, vmID)
	data, err := c.Request("GET", path, nil)
	if err != nil {
		return "", err
	}

	var result struct {
		Data struct {
			Status string `json:"status"`
			VMID   int    `json:"vmid"`
		} `json:"data"`
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return "", err
	}

	return result.Data.Status, nil
}

func (c *Client) GetVMIP(vmID int) (string, error) {
	path := fmt.Sprintf("/nodes/%s/qemu/%d/agent/network-get-interfaces", c.node, vmID)
	data, err := c.Request("GET", path, nil)
	if err != nil {
		return "", err
	}

	var result struct {
		Data struct {
			Result []struct {
				Name        string `json:"name"`
				IPAddresses []struct {
					IPAddress     string `json:"ip-address"`
					IPAddressType string `json:"ip-address-type"`
				} `json:"ip-addresses"`
			} `json:"result"`
		} `json:"data"`
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return "", err
	}

	for _, iface := range result.Data.Result {
		if iface.Name == "eth0" || iface.Name == "ens18" {
			for _, addr := range iface.IPAddresses {
				if addr.IPAddressType == "ipv4" {
					return addr.IPAddress, nil
				}
			}
		}
	}

	return "", fmt.Errorf("no IPv4 address found for VM %d", vmID)
}

func (c *Client) SetSSHKey(vmID int, pubKey string) error {
	path := fmt.Sprintf("/nodes/%s/qemu/%d/config", c.node, vmID)
	encoded := strings.ReplaceAll(url.QueryEscape(strings.TrimSpace(pubKey)), "+", "%20")
	_, err := c.Request("POST", path, map[string]any{
		"sshkeys": encoded,
	})
	return err
}
