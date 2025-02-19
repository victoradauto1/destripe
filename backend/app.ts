import express, {Request, Response, NextFunction} from "express";
import { access } from "fs";
import morgan from "morgan";

const app = express();

app.use(morgan("tiny"));
app.use(express.json());

app.get("/nfts/:tokenId", (req: Request, res:Response, next: NextFunction)=>{
    
    const tokenId = req.params.tokenId.replace(".json", "");
    res.json({
        name:"acess #" + tokenId,
        description: "Your acess to the system X",
        image:`${process.env.BACKEND_URL}/images/${tokenId}.png`
    })
});

app.get("/images:tokenId",(req: Request, res:Response, next: NextFunction)=>{
    
    res.download(`${__dirname}/ticket.png`)
    const tokenId = req.params.tokenId.replace(".json", "");
});

export default app;
