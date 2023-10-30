const { StargateClient } = require('../../CudosJs/build');

async function main() {
    const client = await StargateClient.connect('host.docker.internal:26657');

    // const latestHeight = await client.getHeight();

    // let result = await client.searchTx('message.sender=\'cudos18w06hwzxc7xvkuh809d9c34c8j57ujkrnwktwy\' AND transfer.recipient=\'cudos1ruzlt5zfy4gvjaphewpvxlszul27f3evgs4sfk\' AND tx.height>=20982 AND tx.height<=21082');
    // console.log(result.map((iTx) => iTx.hash));

    let result = await client.searchTx('message.module=\'marketplace\' AND tx.height >= 20000 AND tx.height < 20950');
    console.log(result.map((iTx) => { return { hash: iTx.hash, height: iTx.height } } ));
    console.log(result.length);

    // // result = await client.searchTx('message.module=\'marketplace\' AND tx.height>=5758 AND tx.height<=5858');
    // // console.log(result.map((iTx) => iTx.hash));

    // // result = await client.searchTx('message.sender=\'cudos18w06hwzxc7xvkuh809d9c34c8j57ujkrnwktwy\' AND tx.height>=20982 AND tx.height<=21082');
    // // console.log(result.map((iTx) => iTx.hash));

    // // result = await client.searchTx('transfer.recipient=\'cudos1ruzlt5zfy4gvjaphewpvxlszul27f3evgs4sfk\' AND tx.height>=20982 AND tx.height<=21082');
    // // console.log(result.map((iTx) => iTx.hash));


    // const query = [
    //     // { key: 'message.module', value:  'marketplace'},
    //     // { key: 'message.action', value:  '/cudoventures.cudosnode.marketplace.MsgMintNft'},
    //     { key: 'message.action', value: '/gravity.v1.MsgSendToCosmosClaim' }
    // ]
    // result = await client.searchTxLegacy(query);
    // console.log(result.map((iTx) => { return { hash: iTx.hash, height: iTx.height } } ));
}

main();
