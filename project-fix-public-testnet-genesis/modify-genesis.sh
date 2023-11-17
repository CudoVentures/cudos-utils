#!/bin/bash

sourceGenesis="./cudos-testnet-public-3.export"
resultGenesis="./cudos-testnet-public-4-genesis.json"
validatorConsAddr="cudosvalcons1gd4u6606psdtmuajr5nc77vvm8ghn787jpap4m"

cp "$sourceGenesis" "$resultGenesis"

genesisJson=$(jq ".chain_id=\"cudos-testnet-public-4\"" "$resultGenesis")
echo $genesisJson > "$resultGenesis"

missedBlocksArraySize=$(jq ".app_state.slashing.missed_blocks[] | select(.address == \"$validatorConsAddr\") | .missed_blocks | length" "$resultGenesis")
echo "Missed blocks array size: $missedBlocksArraySize";

missedBlocksCounter=$(jq ".app_state.slashing.signing_infos[] | select(.address == \"$validatorConsAddr\") | .validator_signing_info.missed_blocks_counter" "$resultGenesis")
echo "Missed blocks coutner: $missedBlocksCounter";

genesisJson=$(jq ".chain_id=\"cudos-testnet-public-4\"" "$resultGenesis")
echo $genesisJson > "$resultGenesis"

genesisJson=$(jq ".app_state.slashing.missed_blocks = [.app_state.slashing.missed_blocks[] | if (.address == \"$validatorConsAddr\") then (.missed_blocks = []) else . end]" "$resultGenesis")
echo $genesisJson > "$resultGenesis"

genesisJson=$(jq ".app_state.slashing.signing_infos = [.app_state.slashing.signing_infos[] | if (.address == \"$validatorConsAddr\") then (.validator_signing_info.missed_blocks_counter = \"0\") else . end]" "$resultGenesis")
echo $genesisJson > "$resultGenesis"

chainId=$(jq ".chain_id" "$resultGenesis")
echo "Chain id: $chainId"

slashingMissedBlocksObj=$(jq ".app_state.slashing.missed_blocks[] | select(.address == \"$validatorConsAddr\")" "$resultGenesis")
echo "Missed blocks object: $slashingMissedBlocksObj";

validatorSigningInfoObj=$(jq ".app_state.slashing.signing_infos[] | select(.address == \"$validatorConsAddr\")" "$resultGenesis")
echo "Validator signing info object: $validatorSigningInfoObj";
