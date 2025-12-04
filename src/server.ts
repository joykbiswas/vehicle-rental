import express, { Request, Response } from "express"
import config from "./config";
import dotenv from "dotenv";
import path from "path";
import initDB from "./config/db";
const port = config.port;

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
app.use(express.json());

initDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Developer !!')
})


app.use((req, res) =>{
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
