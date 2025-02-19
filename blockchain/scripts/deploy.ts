import { ethers } from "hardhat";

async function main() {
  // Obtém as contas disponíveis
  const [owner] = await ethers.getSigners();
  
  // Deploy do DestripeCoin
  const DestripeCoin = await ethers.getContractFactory("DestripeCoin");
  const destripeCoin = await DestripeCoin.deploy(
    await owner.getAddress(), // recipient
    await owner.getAddress()  // initialOwner
  );
  await destripeCoin.waitForDeployment();
  console.log("DestripeCoin deployed to:", await destripeCoin.getAddress());

  // Deploy do DestripeCollection
  const DestripeCollection = await ethers.getContractFactory("DestripeCollection");
  const destripeCollection = await DestripeCollection.deploy(
    await owner.getAddress() // initialOwner
  );
  await destripeCollection.waitForDeployment();
  console.log("DestripeCollection deployed to:", await destripeCollection.getAddress());

  // Deploy do Destripe principal
  const Destripe = await ethers.getContractFactory("Destripe");
  const destripe = await Destripe.deploy(
    await destripeCoin.getAddress(),     // tokenAddress
    await destripeCollection.getAddress() // nftAddress
  );
  await destripe.waitForDeployment();
  console.log("Destripe deployed to:", await destripe.getAddress());

  // Configura a autorização do DestripeCollection
  await destripeCollection.setAuthorized(await destripe.getAddress());
  console.log("Authorization set for Destripe contract");

  // Log de todos os endereços para referência
  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("DestripeCoin:", await destripeCoin.getAddress());
  console.log("DestripeCollection:", await destripeCollection.getAddress());
  console.log("Destripe:", await destripe.getAddress());
  console.log("Owner:", await owner.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });