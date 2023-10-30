import { GasPrice, DirectSecp256k1HdWallet, SigningStargateClient, serializeSignDoc, StdFee, Secp256k1Keypair, encodePubkey, makeAuthInfoBytes, Secp256k1, Bip39, EnglishMnemonic, TxBodyEncodeObject, makeSignDoc, makeSignBytes, sha256, toBase64, fromBase64, Sha256, encodeSecp256k1Signature, Secp256k1Signature } from 'cudosjs';

const address = '<address>'
const nftInfos = [new NftInfo('faucet', 'aaaaaaaa', 'qwdwdqwd', 'qwdqwdqw', address)]
const sender = address;

const chainId = Config.CUDOS_NETWORK.CHAIN_ID
const gasPrice = GasPrice.fromString(Config.CUDOS_NETWORK.GAS_PRICE + Config.CUDOS_NETWORK.DENOM);
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(Config.CUDOS_SIGNER.MNEMONIC);
const client = await SigningStargateClient.connectWithSigner(Config.CUDOS_NETWORK.RPC_BACKEND, wallet);

const account = (await wallet.getAccounts())[0];
const pubkey = {
    type: 'tendermint/PubKeySecp256k1',
    value: '<pubkey_as_shown_in_keys_show_command>',
};
const encodedPubkey = encodePubkey(pubkey);
const { sequence, accountNumber } = (await client.getSequence(address))

const { msgs, fee } = await client.nftModule.msgMintMultipleNFT(
    nftInfos,
    sender,
    '',
    gasPrice,
)

const txBodyBytes = client.registry.encodeTxBody({
    messages: msgs,
});

const authInfoBytes = makeAuthInfoBytes(
    [{ pubkey: encodedPubkey, sequence }],
    fee.amount,
    500000,
);

const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, Config.CUDOS_NETWORK.CHAIN_ID, accountNumber);
const signDocBytes = makeSignBytes(signDoc);

const api = 'https://eu.smartkey.io'
const keyId = '<key_uuid>'

const authRes = await axios.post(`${api}/sys/v1/session/auth`, null, {
    headers: {
        'Authorization': 'Basic <api_key>',
    },
}).catch((e) => console.log(e))

const token = authRes.data.access_token;
const a = toBase64(sha256(signDocBytes));

const signRes = await axios.post(
    `${api}/crypto/v1/keys/${keyId}/sign`,
    {
        'hash_alg': 'SHA256',
        'hash': a,
        'deterministic_signature': false,
    },
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    },
).catch((e) => console.log(e))

const signatureDer = fromBase64(signRes.data.signature);
const signature = Secp256k1Signature.fromDer(signatureDer);
const signatureBytes = new Uint8Array([...signature.r(32), ...signature.s(32)]);
const stdSignature = encodeSecp256k1Signature(account.pubkey, signatureBytes);
// console.log(fromBase64(stdSignature.signature));
const txRaw = TxRaw.fromPartial({
    bodyBytes: txBodyBytes,
    authInfoBytes,
    signatures: [stdSignature.signature],
});

const txRawBytes = Uint8Array.from(TxRaw.encode(txRaw).finish());
const broadcastResponse = await client.broadcastTx(txRawBytes);

console.log(broadcastResponse);
