import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import artifacts from "./DestripeCollection.json";

import { ethers } from "ethers";

function getContract(): ethers.Contract {
  const provider = new ethers.InfuraProvider(
    `${process.env.NETWORK}`,
    `${process.env.INFURA_API_KEY}`
  );

  return new ethers.Contract(
    `${process.env.DESTRIPE_CONTRACT}`,
    artifacts,
    provider
  );
}

function ownerOf(tokenId: number): Promise<string> {
  return getContract().ownerOf(tokenId);
}

const app = express();

app.use(morgan("tiny"));
app.use(express.json());

app.get("/nfts/:tokenId", async(req: Request, res: Response, next: NextFunction) => {
  const tokenId = req.params.tokenId.replace(".json", "");
  const ownerAddress = await ownerOf(parseInt(tokenId));
  if(ownerAddress == ethers.ZeroAddress) 
    return res.sendStatus(404);
  res.json({
    name: "acess #" + tokenId,
    description: "Your acess to the system X",
    image: `${process.env.BACKEND_URL}/images/${tokenId}.png`,
  });
});

app.get(
  "/images:tokenId", async(req: Request, res: Response, next: NextFunction) => {  
    const tokenId = req.params.tokenId.replace(".png", "");

    const ownerAddress = await ownerOf(parseInt(tokenId));
    if(ownerAddress == ethers.ZeroAddress) 
      return res.sendStatus(404);
    
    res.download(`${__dirname}/ticket.png`);
  }
);

export default app;
