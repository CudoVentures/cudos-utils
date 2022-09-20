#!/bin/bash -i

source "./inc/var.sh";

rm -rf "$CUDOS_HOME"
mkdir -p "$CUDOS_HOME"

mkdir -p "$CUDOS_HOME/data"
mkdir -p "$HOME/bin"

mkdir -p "$CUDOS_HOME/cosmovisor/genesis/bin"
mkdir -p "$CUDOS_HOME/cosmovisor/upgrades/privatetestnet04-v1.1.0/bin"

cp "$PARENT_PATH/bin/0.8.0/cudos-noded" "$HOME/bin"
cp "$PARENT_PATH/bin/1.1.0/cudos-noded" "$CUDOS_HOME/cosmovisor/upgrades/privatetestnet04-v1.1.0/bin"
cp "$PARENT_PATH/bin/cosmovisor" "$HOME/bin"

cp "$PARENT_PATH/bin/0.8.0/cudos-noded" "$CUDOS_HOME/cosmovisor/genesis/bin"
ln -s "$CUDOS_HOME/cosmovisor/genesis" "$CUDOS_HOME/cosmovisor/current"

chmod +x "$PARENT_PATH/bin/cosmovisor"
source "./inc/init-root.sh"
cosmovisor run start

