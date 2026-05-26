package proxmox

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type Client struct {
	host       string
	tokenID    string
	tokenSecret string
	node       string
	httpClient *http.Client
}

func NewClient() *Client {
	return &Client{
		host:        os.Getenv("PROXMOX_HOST"),
		tokenID:     os.Getenv("PROXMOX_TOKEN_ID"),
		tokenSecret: os.Getenv("PROXMOX_TOKEN_SECRET"),
		node:        os.Getenv("PROXMOX_NODE"),
		httpClient: &http.Client{
			Transport: &http.Transport{
				TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
			},
		},
	}
}

func (c *Client) request(method, path string, body any) ([]byte, error) {
	var bodyReader io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		bodyReader = bytes.NewReader(data)
	}

	url := fmt.Sprintf("https://%s:8006/api2/json%s", c.host, path)
	req, err := http.NewRequest(method, url, bodyReader)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf(
		"PVEAPIToken=%s=%s", c.tokenID, c.tokenSecret,
	))
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		b, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("proxmox error %d: %s", resp.StatusCode, string(b))
	}

	return io.ReadAll(resp.Body)
}

func (c *Client) Version() (map[string]any, error) {
	data, err := c.request("GET", "/version", nil)
	if err != nil {
		return nil, err
	}
	var result struct {
		Data map[string]any `json:"data"`
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}
