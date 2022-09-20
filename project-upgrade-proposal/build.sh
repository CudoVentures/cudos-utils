#!/bin/bash -i

source "./inc/var.sh";

cd /usr/cudos/CudosNode
make install

mv /go/bin/cudos-noded "$PARENT_PATH/bin/1.1.0/cudos-noded"
