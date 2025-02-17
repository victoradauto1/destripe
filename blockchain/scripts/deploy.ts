import hre, { ethers } from "hardhat";

async function main(){
    const DestripeCoin = await hre.ethers.getContractFactory("DestripeCoin");
    const destripeCoin = await DestripeCoin.deploy(owner.getAddress(), owner.getAddress());

    await destripeCoin.waitForDeployment();

    const DestripeCollection = await hre.ethers.getContractFactory("DestripeCollection");
    const destripeColletion = await DestripeCollection.deploy(owner.getAddress());

    await destripeColletion.waitForDeployment();

    const Destripe = await hre.ethers.getContractFactory("Destripe");
    const destripe = await Destripe.deploy(destripeCoin.getAddress(), destripeColletion.getAddress() );

    await destripe.waitForDeployment();

    await destripeColletion.setAuthorized(destripe.getAddress());


    console.log(`Contract deployed to ${destripe.getAddress()}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1); 
});