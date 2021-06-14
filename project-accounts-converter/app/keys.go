package main

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	myTypes "cudos.org/accounts-converter/app/types"

	"github.com/cosmos/cosmos-sdk/crypto/keys/secp256k1"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/bech32"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

func main() {
	resp, err := http.Get("https://api.etherscan.io/api?module=account&action=txlist&address=0xb3ccb8FB2533E51893915908CEb85763CeaeA97b&startblock=11633453&endblock=99999999&sort=asc&apikey=YourApiKeyToken")
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	var res myTypes.EtherscanResponse
	json.Unmarshal(body, &res)

	fmt.Println(res.Result[0].Hash)

	client, err := ethclient.Dial("https://mainnet.infura.io/v3/<project id>")
	if err != nil {
		panic(err)
	}

	hash := common.HexToHash(res.Result[0].Hash)
	transaction, _, err := client.TransactionByHash(context.Background(), hash)
	if err != nil {
		panic(err)
	}

	fmt.Println(transaction.H)

	chainID, err := client.NetworkID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	if msg, err := transaction.AsMessage(types.NewEIP155Signer(chainID)); err != nil {
		fmt.Println(msg.) // 0x0fD081e3Bb178dc45c0cb23202069ddA5
	}

	// account := common.HexToAddress("0xb3ccb8FB2533E51893915908CEb85763CeaeA97b")
	// balance, err := client.BalanceAt(context.Background(), account, nil)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// fmt.Println(balance) // 25893180161173005034
}

func ecrecoverFunc(in []byte) []byte {
	in = common.RightPadBytes(in, 128)
	// "in" is (hash, v, r, s), each 32 bytes
	// but for ecrecover we want (r, s, v)

	r := common.BytesToBig(in[64:96])
	s := common.BytesToBig(in[96:128])
	// Treat V as a 256bit integer
	vbig := common.Bytes2Big(in[32:64])
	v := byte(vbig.Uint64())

	if !crypto.ValidateSignatureValues(v, r, s) {
		glog.V(logger.Error).Infof("EC RECOVER FAIL: v, r or s value invalid")
		return nil
	}

	// v needs to be at the end and normalized for libsecp256k1
	vbignormal := new(big.Int).Sub(vbig, big.NewInt(27))
	vnormal := byte(vbignormal.Uint64())
	rsv := append(in[64:128], vnormal)
	pubKey, err := crypto.Ecrecover(in[:32], rsv)
	// make sure the public key is a valid one
	if err != nil {
		glog.V(logger.Error).Infof("EC RECOVER FAIL: ", err)
		return nil
	}

	// the first byte of pubkey is bitcoin heritage
	return common.LeftPadBytes(crypto.Sha3(pubKey[1:])[12:], 32)
}

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
