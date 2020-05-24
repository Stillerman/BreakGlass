import express from "express";
import cors from "cors";
import router from "./routes";

const app = express();

app.use(cors());
app.use(router);

declare var __dirname;

app.use(express.static(__dirname + "/../../breakglass-ui/dist"));

console.log("Running app on 8080");

app.listen(8080);
