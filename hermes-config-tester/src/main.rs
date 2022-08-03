use tonic::{transport::Error };
use ibc_proto::cosmos::tx::v1beta1::service_client::ServiceClient;
use std::{thread, time};
use ibc_proto::ibc::core::connection::v1 as connection;

#[tokio::main]
async fn main() -> Result<(), Error> {

    let osmosis_grpc_address = "http://osmosis-mainnet.hosts.cudos.org:9090";
    let cudos_grpc_address = "http://mainnet-full-node-01.hosts.cudos.org:9090";

   
    // connection client
    for i in 0..1000 {
        println!("Run #{}\n", i);
        println!("---------------");
        println!("\ngRPC address : {}\n", osmosis_grpc_address);
        println!("---------------");
        test_address(osmosis_grpc_address).await;

        println!("---------------");
        println!("\ngRPC address : {}\n", cudos_grpc_address);
        println!("---------------");
        test_address(cudos_grpc_address).await;
        println!("-------------------------------------------------");
    }

    Ok(())
}

async fn test_address(grpc_address:  &'static str) {
    match connection::query_client::QueryClient::connect(grpc_address.clone()).await {
        Ok(_) => {println!("Connection client connected")},
        Err(err) => {
            println!("Connection client error: {}", err);
            panic!("END")
        },
    };
    
    //staking client
    match ibc_proto::cosmos::staking::v1beta1::query_client::QueryClient::connect(grpc_address.clone()).await {
        Ok(_) => {println!("Staking client connected")},
        Err(err) => {
            println!("Staking client error: {}", err);
            panic!("END")
        },
    };
    
    
    //cosmos tx Service
    match ServiceClient::connect(grpc_address.clone()).await {
        Ok(_) => {println!("Cosmos TX Service connected")},
        Err(err) => {
            println!("Cosmos TX Service error: {}", err);
            panic!("END")
        },
    };

    //Bank query klient
    match ibc_proto::cosmos::bank::v1beta1::query_client::QueryClient::connect(grpc_address.clone()).await {
        Ok(_) => {println!("Bank client connected")},
        Err(err) => {
            println!("Bank client error: {}", err);
            panic!("END")
        },
    };

    // ibc client
    match ibc_proto::ibc::core::client::v1::query_client::QueryClient::connect(grpc_address.clone()).await {
        Ok(_) => {println!("IBC core client connected")},
        Err(err) => {
            println!("IBC core client error: {}", err);
            panic!("END")
        },
    };

    //IBC connection
    match ibc_proto::ibc::core::connection::v1::query_client::QueryClient::connect(grpc_address.clone()).await {
        Ok(_) => {println!("IBC connection connected")},
        Err(err) => {
            println!("IBC connection error: {}", err);
            panic!("END")
        },
    };

    //IBC channel
    match ibc_proto::ibc::core::channel::v1::query_client::QueryClient::connect(grpc_address.clone()).await {
        Ok(_) => {println!("IBC channel connected")},
        Err(err) => {
            println!("IBC channel error: {}", err);
            panic!("END")
        },
    };

    //IBC auth
    match ibc_proto::cosmos::auth::v1beta1::query_client::QueryClient::connect(grpc_address.clone()).await {
        Ok(_) => {println!("IBC auth connected")},
        Err(err) => {
            println!("IBC auth error: {}", err);
            panic!("END")
        },
    };

    //IBC transfer query client
    match ibc_proto::ibc::applications::transfer::v1::query_client::QueryClient::connect(grpc_address.clone()).await {
        Ok(_) => {println!("IBC transfer query client connected")},
        Err(err) => {
            println!("IBC transfer query client error: {}", err);
            panic!("END")
        },
    };
    thread::sleep(time::Duration::from_millis(500));

}