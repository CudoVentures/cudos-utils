#!/bin/bash

set -e

usage()
{
cat << EOF
usage: $0 --input INPUT --curve CURVE --output OUTPUT

This script converts raw hex private EC keys to DER format. The curve needs to
be passed as parameter. It reads the key from --input and outputs the private
DER key to --output.

Contact: francisco.vialprado@fortanix.com

Example: $0 --input=raw.key --curve=secp256k1 --output=mykey.der

OPTIONS:
   --curve     The elliptic curve [secp256k1, ed25519]
   --input     The input file.
   --output    The output file.
EOF
}

input=
prefix=
output=
for i in "$@"
do
    case $i in
        --input=*)
            input=`echo $i | sed 's/[-a-zA-Z0-9]*=//'`
            ;;
        --curve=secp256k1)
            # Example key:
            # MHQCAQEEII+Gid8KTdFsUs9ESJNONch9nLfcR5VVBE1PUbkxhwj3oAcGBSuBBAAK
            # oUQDQgAE8ff5L67s7a+MBOV7JvfP1jIo7XqQ3DV/i+zHFPsfmN6f+aboJH24UfGW
            # i8nbmHH1I397/wgFg06EJ1nCv9z/eA==

            # Note that we don't include the public key, so we correct the
            # length of the sequence (sequence of 48 bytes -> 302e)
            prefix="302e0201010420"
            # The curve identifier
            suffix="a00706052b8104000a"
            ;;
        --curve=*)
            printf "\nUnsupported %s\n" "$i"
            exit 1
            ;;
        --output=*)
            output=`echo $i | sed 's/[-a-zA-Z0-9]*=//'`
            ;;
        *)
            usage
            exit 1
            ;;
    esac
done

if [ -z "$input" ] || [ -z "$prefix" ] || [ -z "$suffix" ] || [ -z "$output" ]; then
    usage
    exit 1;
fi

key=$(cat "$input")
echo "$prefix$key$suffix" > "$output"
