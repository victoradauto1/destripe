// src/modules/DestripeModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DestripeModule = buildModule("DestripeModule", (m) => {
  // Obtém o owner do deploy
  const owner = m.getAccount(0);

  // Deploy do DestripeCoin
  const destripeCoin = m.contract("DestripeCoin", [
    owner, // recipient
    owner  // initialOwner
  ]);

  // Deploy do DestripeCollection
  const destripeCollection = m.contract("DestripeCollection", [
    owner // initialOwner
  ]);

  // Deploy do contrato Destripe principal
  const destripe = m.contract("Destripe", [
    destripeCoin,     // tokenAddress
    destripeCollection // nftAddress
  ]);

  // Configura a autorização após o deploy
  m.call(destripeCollection, "setAuthorized", [destripe]);

  // Retorna todos os contratos para referência
  return {
    destripeCoin,
    destripeCollection,
    destripe
  };
});

export default DestripeModule;