package main

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strings"

	appTypes "cudos.org/accounts-converter/app/types"

	"github.com/cosmos/cosmos-sdk/crypto/keys/secp256k1"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/bech32"
)

func main() {
	var sb strings.Builder

	dataTransferModels := loadDataTransferModels()
	walletsMap := loadWallets()

	for _, dataTransferModel := range dataTransferModels {
		var walletModel, exists = walletsMap[dataTransferModel.EthAddr]
		if !exists {
			continue
		}

		cosmosAddr := convertEthToCosmosAddr(dataTransferModel.PublicKey33BytesHexed)
		genesisAccount := fmt.Sprintf("cudos-noded add-genesis-account %s %s\n", cosmosAddr, walletModel.Balance)
		sb.WriteString(genesisAccount)
		fmt.Print(genesisAccount)
		// fmt.Printf("%s -> %s\n", dataTransferModel.EthAddr, dataTransferModel.CosmosAddr)
		//cudos-noded add-genesis-account $ZERO_ACCOUNT_ADDRESS "1${BOND_DENOM}"
	}

	os.Mkdir("./output", 0775)
	ioutil.WriteFile("./output/add-genesis.sh", []byte(sb.String()), 0775)
}

func loadDataTransferModels() []appTypes.DataTransferModel {
	content, err := ioutil.ReadFile("../project-accounts-fetcher/output/data-transfer.json")
	if err != nil {
		panic(err)
	}

	var dataTransferModels []appTypes.DataTransferModel
	json.Unmarshal(content, &dataTransferModels)

	return dataTransferModels
}

func loadWallets() map[string]appTypes.WalletModel {
	var walletsMap = make(map[string]appTypes.WalletModel)

	content, err := ioutil.ReadFile("./input/wallets.json")
	if err != nil {
		panic(err)
	}

	var walletModels []appTypes.WalletModel
	json.Unmarshal(content, &walletModels)

	for _, walletModel := range walletModels {
		walletsMap[walletModel.Address] = walletModel
		// fmt.Printf("Wallets %s -> %s\n", walletModel.Address, walletModel.Balance)
	}

	return walletsMap

}

func convertEthToCosmosAddr(ethPublicKey33BytesHexed string) string {
	if ethPublicKey33BytesHexed[:2] == "0x" {
		ethPublicKey33BytesHexed = ethPublicKey33BytesHexed[2:]
	}

	ethPublicKey33Bytes, err := hex.DecodeString(ethPublicKey33BytesHexed)
	if err != nil {
		panic(err)
	}

	pubKey := secp256k1.PubKey{
		Key: ethPublicKey33Bytes,
	}
	accAddrString, err := sdk.AccAddressFromHex(pubKey.Address().String())
	if err != nil {
		panic(err)
	}

	cosmosAddr, err := bech32.ConvertAndEncode("cudos", accAddrString)
	if err != nil {
		panic(err)
	}
	return cosmosAddr
}

func oldMain() {
	fmt.Println(os.Args)
	if len(os.Args) != 2 {
		panic(fmt.Sprintf("Expected exactly 1 argument but recieved %d", len(os.Args)-1))
	}

	ethPubKeyString := os.Args[1]
	convertEthToCosmosAddr(ethPubKeyString)
}
