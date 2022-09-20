#!/bin/bash -i

CUDOS_HOME="$HOME/cudos-data"
PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
PARENT_PATH=$(dirname $PARENT_PATH)
CHAIN_ID="cudos-testnet-node"
PATH="$PATH:$HOME/bin"

export DAEMON_HOME="$CUDOS_HOME"
export DAEMON_NAME="cudos-noded"
