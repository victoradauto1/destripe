import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks:{
    amoy:{
      url: process.env.INFURA_URL,
      chainId:parseInt(`${process.env.CHAIN_ID}`),
      accounts:{
        mnemonic:`${process.env.SECRET}`
      }
    }
  },
  etherscan:{
    apiKey:`${process.env.API_KEY}`
  }
};

export default config;
