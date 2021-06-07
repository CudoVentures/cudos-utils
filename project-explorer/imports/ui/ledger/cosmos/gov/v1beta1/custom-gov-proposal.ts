import {DirectSecp256k1HdWallet, Registry} from "@cosmjs/proto-signing";
import {defaultGasPrice, defaultRegistryTypes, SigningStargateClient} from "@cosmjs/stargate";
import {MsgSubmitProposal} from "./tx";
import {TextProposal} from "./gov"; // Replace with your own Msg import

async function test() {

    const myRegistry = new Registry([
        ...defaultRegistryTypes,
        ["/cosmos.gov.v1beta1.MsgSubmitProposal", MsgSubmitProposal], // Replace with your own type URL and Msg class
    ]);
    // defaultGasPrice.denom = 'stake'
    const mnemonic = // Replace with your own mnemonic
        "trigger peace action sister guilt index panda oval alter hub stand movie visit liar stick tuna journey wise pattern dial once chimney bicycle before";

// Inside an async function...
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(
        mnemonic,
        {prefix: "cudos"}, // Replace with your own Bech32 address prefix
    );
    const client = await SigningStargateClient.connectWithSigner(
        "http://localhost:26657", // Replace with your own RPC endpoint
        signer,
        {
            registry: myRegistry,
        },
    );

    const myAddress = "cudos1d2lwlvm7jxghw3q638nymeadatj794prudncvq";
    const message = {
        typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal", // Same as above
        value: {
            content: {
                "typeUrl": "/cosmos.gov.v1beta1.TextProposal",
                value: TextProposal.encode({
                    title: "Test Proposal",
                    description: "My awesome proposal"
                }).finish()
            },
            initialDeposit: [{denom: "stake", amount: "100000"}],
            proposer: "cudos1d2lwlvm7jxghw3q638nymeadatj794prudncvq"
        },
    };
    const fee = {
        amount: [
            {
                denom: "stake", // Use the appropriate fee denom for your chain
                amount: "10",
            },
        ],
        gas: "100000",
    };

// Inside an async function...
// This method uses the registry you provided
    const response = await client.signAndBroadcast(myAddress, [message], fee);
    return response
}

test().then((x) => console.log(JSON.stringify(x)))