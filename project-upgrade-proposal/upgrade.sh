#!/bin/bash -i

source "./inc/var.sh";

TMP_STATUS_PATH="/tmp/cudos-noded.status"

cudos-noded status |& tee "$TMP_STATUS_PATH" &> /dev/null;
currentHeight=$(jq ".SyncInfo.latest_block_height" "$TMP_STATUS_PATH")
currentHeight=${currentHeight//\"/}
upgradeHeight=$(($currentHeight + 4))

faucetAddress=$(cudos-noded keys show faucet -a --keyring-backend test)
validatorAddress=$(cudos-noded keys show validator-1 -a --keyring-backend test)

cudos-noded tx bank send "$faucetAddress" "$validatorAddress" 100000000000000000000000000acudos --from faucet --chain-id $CHAIN_ID --gas-prices 5000000000000acudos --keyring-backend test -y

cudos-noded tx gov submit-proposal software-upgrade "privatetestnet04-v1.1.0" --upgrade-height $upgradeHeight  --description "test proposal" --title "PrivateTestnet04-v1.1.0" --deposit 50000000000000000000000acudos --from validator-1 --chain-id $CHAIN_ID --gas-prices 5000000000000acudos --keyring-backend test -y

cudos-noded tx gov vote 1 yes --from validator-1 --chain-id $CHAIN_ID --gas-prices 5000000000000acudos --keyring-backend test -y


