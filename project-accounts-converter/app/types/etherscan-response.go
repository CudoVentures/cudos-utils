package types

type EtherscanResponse struct {
	Status  string        `json:"status"`
	Message string        `json:"message"`
	Result  []Transaction `json:"result"`
}
