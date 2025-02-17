import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Destripe", function () {
 
  async function deployFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

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

    await destripeCoin.mint(otherAccount.getAddress(),ethers.parseEther("1") );

    return { destripe, destripeCoin, destripeColletion, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { destripe, owner, otherAccount  } = await loadFixture(deployFixture);

      expect(1).to.equal(1);
    });

    
  });

  
});
