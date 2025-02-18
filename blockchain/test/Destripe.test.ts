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
    const destripeCoin = await DestripeCoin.deploy(
      owner.getAddress(),
      owner.getAddress()
    );

    await destripeCoin.waitForDeployment();

    const DestripeCollection = await hre.ethers.getContractFactory(
      "DestripeCollection"
    );
    const destripeCollection = await DestripeCollection.deploy(
      owner.getAddress()
    );

    await destripeCollection.waitForDeployment();

    const Destripe = await hre.ethers.getContractFactory("Destripe");
    const destripe = await Destripe.deploy(
      destripeCoin.getAddress(),
      destripeCollection.getAddress()
    );

    await destripe.waitForDeployment();

    await destripeCollection.setAuthorized(destripe.getAddress());

    await destripeCoin.mint(otherAccount.getAddress(), ethers.parseEther("1"));

    return { destripe, destripeCoin, destripeCollection, owner, otherAccount };
  }

  describe("Destripe", function () {
    it("Should do first payment", async function () {
      const {
        destripe,
        destripeCoin,
        destripeCollection,
        owner,
        otherAccount,
      } = await loadFixture(deployFixture);

      const instance = destripeCoin.connect(otherAccount);
      await instance.approve(
        destripe.getAddress(),
        hre.ethers.parseEther("0.01")
      );

      expect(await destripe.pay(otherAccount.address)).to.emit(
        destripe,
        "Granted"
      );
    });

    it("Should NOT do first payment", async function () {
      const {
        destripe,
        destripeCoin,
        otherAccount,
      } = await loadFixture(deployFixture);

      const instance = destripeCoin.connect(otherAccount);
      await instance.approve(
        destripe.getAddress(),
        hre.ethers.parseEther("0.0001")
      );

      expect(await destripe.pay(otherAccount.address)).to.emit(
        destripe,
        "Revoked"
      );
    });

    it("Should do second payment", async function () {
      const {
        destripe,
        destripeCoin,
        destripeCollection,
        owner,
        otherAccount,
      } = await loadFixture(deployFixture);

      const instance = destripeCoin.connect(otherAccount);
      await instance.approve(
        destripe.getAddress(),
        hre.ethers.parseEther("0.01")
      );

      await destripe.pay(otherAccount.address);
   
      await time.increase(31*24*60*60);

      expect(await destripe.pay(otherAccount.address)).to.emit(destripe, "Paid");
    });

    it("Should NOT do second payment", async function () {
      const {
        destripe,
        destripeCoin,
        destripeCollection,
        owner,
        otherAccount,
      } = await loadFixture(deployFixture);

      const instance = destripeCoin.connect(otherAccount);
      await instance.approve(
        destripe.getAddress(),
        hre.ethers.parseEther("0.01")
      );

      await destripe.pay(otherAccount.address);
   
      await time.increase(31*24*60*60);

      await instance.approve(
        destripe.getAddress(),
        hre.ethers.parseEther("0.000001")
      );

      expect(await destripe.pay(otherAccount.address)).to.emit(destripe, "Revoked");
    });

    it("Should do second payment after Revoked", async function () {
      const {
        destripe,
        destripeCoin,
        destripeCollection,
        owner,
        otherAccount,
      } = await loadFixture(deployFixture);

      const instance = destripeCoin.connect(otherAccount);
      await instance.approve(
        destripe.getAddress(),
        hre.ethers.parseEther("0.01")
      );

      await destripe.pay(otherAccount.address);
   
      await time.increase(31*24*60*60);

      await instance.approve(
        destripe.getAddress(),
        hre.ethers.parseEther("0.000001")
      );

      await destripe.pay(otherAccount.address);

      await instance.approve( destripe.getAddress(),
      hre.ethers.parseEther("0.01"));

      expect(await destripe.pay(otherAccount.address)).to.emit(destripe, "Granted");
    });
  });
});
