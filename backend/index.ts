import dotenv from "dotenv";
dotenv.config();

import artifacts from "./Destripe.json";

import {ethers} from "ethers";

function getContract():ethers.Contract {
    const provider = new ethers.InfuraProvider(`${process.env.NETWORK}`,`${process.env.INFURA_API_KEY}` );

    return new ethers.Contract(`${process.env.DESTRIPE_CONTRACT}`, artifacts, provider );
};

function getSigner():ethers.Contract {
    const provider = new ethers.InfuraProvider(`${process.env.NETWORK}`,`${process.env.INFURA_API_KEY}` );
    const signer =  new ethers.Wallet(`${process.env.PRIVATE_KEY, provider}`)

    return new ethers.Contract(`${process.env.DESTRIPE_CONTRACT}`, artifacts, signer );
};

function getCustomers():Promise<string[]>{
    return getContract().getCustomers()
}

type Customer = {
    tokenId:number;
    index: number;
    nextPayment: number;
}

function getCustomersInfo(customer: string):Promise<Customer>{
    return getContract().payment(customer) as Promise<Customer>;
}

async function pay(customer: string):Promise<string>{
    const tx = await getSigner().pay(customer);
    const receit = await tx.wait();
    return tx.hash;
} 

async function paymentCycle(){
    console.log("Executing the payment cycling...");
    const customers = await getCustomers();
    console.log(customers);

    for(let i=0; i < customers.length; i++){
        if(customers[i] === ethers.ZeroAddress) continue;
        const customer = await getCustomersInfo(customers[i]);
        if(customer.nextPayment <= Date.now())
            await pay(customers[i]);
    }

    console.log("Finishing the payment cycling...")
}

setInterval(paymentCycle ,60*60*1000)

import app from "./app";
import { Console } from "console";

const PORT: number = parseInt(`${process.env.PORT || 3000}`);

app.listen(PORT, ()=> console.log(`App is running at ${PORT}`));
