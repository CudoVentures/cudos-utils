package main

import (
	"context"
	"crypto/ecdsa"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/big"
	"net/http"
	"os"
	"strings"

	appTypes "cudos.org/accounts-converter/app/types"
	ethTypes "github.com/ethereum/go-ethereum/core/types"

	"github.com/cosmos/cosmos-sdk/crypto/keys/secp256k1"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/bech32"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/joho/godotenv"
)

func main() {
	loadEnv()
	jsonTx := getJsonTx()
	ethTx := getTx(jsonTx)
	hashBytes, sig := getSigData(ethTx)
	// publicKeyHex := getPublicKeyHex(hashBytes, sig)
	publicKey := getPublicKey(hashBytes, sig)

	recoveredAddr := crypto.PubkeyToAddress(*publicKey)

	// fmt.Printf("Public key %s\n", publicKey.)
	fmt.Printf("Derived address %s\n", recoveredAddr)
}

func loadEnv() {
	err := godotenv.Load("./config/.env")
	if err != nil {
		panic(err)
	}
}

func getJsonTx() *appTypes.Transaction {
	var etherscanRes appTypes.EtherscanResponse
	var result *appTypes.Transaction = nil

	// resp, err := http.Get("https://api.etherscan.io/api?module=account&action=txlist&address=0xb3ccb8FB2533E51893915908CEb85763CeaeA97b&startblock=11633453&endblock=99999999&sort=asc&apikey=YourApiKeyToken")
	resp, err := http.Get("https://api.etherscan.io/api?module=account&action=txlist&address=0x817bbdbc3e8a1204f3691d14bb44992841e3db35&startblock=12000000&endblock=99999999&sort=asc&apikey=YourApiKeyToken")
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	json.Unmarshal(body, &etherscanRes)

	fmt.Printf("Total transactions %d\n", len(etherscanRes.Result))
	for _, tx := range etherscanRes.Result {
		if strings.EqualFold(tx.From, "0xbc16Ab24d16b66deB9B408ee4C8b6d6CbcC4449b") {
			result = &tx
			break
		}
	}

	if result == nil {
		panic("Transaction not found")
	}

	fmt.Printf("Selected transaction hash %s\n", result.Hash)

	return result
}

func getTx(jsonTx *appTypes.Transaction) *ethTypes.Transaction {
	client, err := ethclient.Dial("https://mainnet.infura.io/v3/" + os.Getenv("INFURA_PROJECT_ID"))
	if err != nil {
		panic(err)
	}

	hash := common.HexToHash(jsonTx.Hash)
	tx, _, err := client.TransactionByHash(context.Background(), hash)
	if err != nil {
		panic(err)
	}

	return tx
}

func getSigData(tx *ethTypes.Transaction) ([]byte, []byte) {
	var i37 = new(big.Int).SetUint64(37)
	// var i38 = new(big.Int).SetUint64(38)
	var vByte byte
	sig := make([]byte, 0)

	v, r, s := tx.RawSignatureValues()

	if v.Cmp(i37) == 0 {
		vByte = 0
	} else {
		vByte = 1
	}

	fmt.Println(v)

	// vBytes := v.Bytes()
	rBytes := r.Bytes()
	sBytes := s.Bytes()
	hashBytes, _ := hex.DecodeString(tx.Hash().Hex()[2:])

	fmt.Printf("R Bytes:\n")
	fmt.Println(rBytes)
	fmt.Printf("S Bytes:\n")
	fmt.Println(sBytes)
	fmt.Printf("V Byte:\n")
	fmt.Println(vByte)

	// if !crypto.ValidateSignatureValues(vByte, r, s, true) {
	// 	panic("EC RECOVER FAIL: v, r or s value invalid")
	// }

	// in = append(in, hashBytes...)
	sig = append(sig, rBytes...)
	sig = append(sig, sBytes...)
	sig = append(sig, vByte)

	return hashBytes, sig
}

func getPublicKeyHex(hashBytes []byte, sig []byte) string {
	publicKeyBytes, err := crypto.Ecrecover(hashBytes, sig)
	if err != nil {
		panic(err)
	}

	publicKeyBytes = publicKeyBytes[1:]
	var publicKeyHex = "0x" + hex.EncodeToString(publicKeyBytes)
	fmt.Printf("Public key length = %d and bytes:\n", len(publicKeyBytes))
	fmt.Println(publicKeyBytes)
	fmt.Printf("Public key hex: %s with length %d\n", publicKeyHex, len(publicKeyHex))

	return publicKeyHex
}

func getPublicKey(hashBytes []byte, sig []byte) *ecdsa.PublicKey {
	publicKey, err := crypto.SigToPub(hashBytes, sig)
	if err != nil {
		panic(err)
	}

	return publicKey
}

// func ecrecoverFunc(in []byte) []byte {
// 	in = common.RightPadBytes(in, 128)
// 	// "in" is (hash, v, r, s), each 32 bytes
// 	// but for ecrecover we want (r, s, v)

// 	common.by
// 	r := common.BytesToBig(in[64:96])
// 	s := common.BytesToBig(in[96:128])
// 	// Treat V as a 256bit integer
// 	vbig := common.Bytes2Big(in[32:64])
// 	v := byte(vbig.Uint64())

// 	if !crypto.ValidateSignatureValues(v, r, s, true) {
// 		fmt.Println("EC RECOVER FAIL: v, r or s value invalid")
// 		return nil
// 	}

// 	// v needs to be at the end and normalized for libsecp256k1
// 	vbignormal := new(big.Int).Sub(vbig, big.NewInt(27))
// 	vnormal := byte(vbignormal.Uint64())
// 	rsv := append(in[64:128], vnormal)
// 	pubKey, err := crypto.Ecrecover(in[:32], rsv)
// 	// make sure the public key is a valid one
// 	if err != nil {
// 		fmt.Println("EC RECOVER FAIL: ", err)
// 		return nil
// 	}

// 	// the first byte of pubkey is bitcoin heritage
// 	return common.LeftPadBytes(crypto.Sha3(pubKey[1:])[12:], 32)
// }

func a() {
	fmt.Println(os.Args)
	if len(os.Args) != 2 {
		panic(fmt.Sprintf("Expected exactly 1 argument but recieved %d", len(os.Args)-1))
	}

	ethPubKeyString := os.Args[1]
	if ethPubKeyString[:2] == "0x" {
		ethPubKeyString = ethPubKeyString[2:]
	}

	fmt.Println(ethPubKeyString)
	ethPubKeyBytes, err := hex.DecodeString(ethPubKeyString)
	if err != nil {
		panic(err)
	}

	ethPubKey := secp256k1.PubKey{
		Key: ethPubKeyBytes,
	}
	accAddrString, err := sdk.AccAddressFromHex(ethPubKey.Address().String())
	if err != nil {
		panic(err)
	}
	addrString, err := bech32.ConvertAndEncode("cosmos", accAddrString)
	if err != nil {
		panic(err)
	}
	fmt.Println(addrString)
}
