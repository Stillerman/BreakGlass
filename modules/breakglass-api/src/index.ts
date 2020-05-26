import express from "express";
import cors from "cors";
import router from "./routes";
import { signIntoServiceAccount } from "../../breakglass-core";
import { getConf } from "./getConf";

const saKey = getConf().ServiceAccountKey;
signIntoServiceAccount(saKey.client_email, JSON.stringify(saKey));

const app = express();

app.use(cors());
app.use(router);

declare var __dirname;

app.use(express.static(__dirname + "/../../breakglass-ui/dist"));

console.log("Running app on 8080");

app.listen(8080);
