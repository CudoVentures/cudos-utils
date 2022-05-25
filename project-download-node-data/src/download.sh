basePath=$(basename $(pwd))
if [ "$basePath" != "project-download-node-data" ]; then
    echo -e "\033[1;31mError:\033[m The script MUST be executed from project-download-node-data folder";
    exit 1
fi

source "./src/incs/var.sh"

count="0"
for y in {a..z}; do
    for z in {a..z}; do
        if (("$count" >= "$PARAM_NUMBER_OF_PIECES")); then
            break 2
        fi
        path="$PARAM_DOWNLOAD_DIR/x$y$z"
        if [ ! -f "$path" ]; then
            echo "downloading $path"
            scp ext_k_stoykov_razorlabs_com@34.102.4.198:/mnt/disks/cudos-node-data/x$y$z "$PARAM_DOWNLOAD_DIR"
        fi
        count=$((count + 1))
    done
done
