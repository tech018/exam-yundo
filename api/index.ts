import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { bodyParser as InterfaceBodyParser } from "src/interface/server";

dotenv.config();

import userRoutes from "./src/routes/users";

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("server is working");
});

app.use(cors());
app.use(
  bodyParser.urlencoded(<InterfaceBodyParser>{
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
