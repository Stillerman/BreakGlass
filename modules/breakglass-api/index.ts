import express from "express";
import cors from "cors";

import { getProjects, grantRole, Project, toProject } from "../breakglass-core";
import bodyParser from "body-parser";
import jwtDecode from "jwt-decode";

const app = express();

export function validateUser(req, res, next) {
  let decoded = jwtDecode(req.headers["x-access-token"]);

  if (!decoded) {
    res.status(401).send("You did not provide jwt");
  } else if (decoded.exp * 1000 <= Date.now()) {
    res.status(401).send("JWT is expired!");
  } else {
    req.user = decoded;
    next();
  }
}

app.use(cors());

app.get("/getProjects", validateUser, async (req, res) => {
  let projects = await getProjects();
  return res.json(projects);
});

type RoleRequest = {
  role: string;
  project: Project;
  user: string;
  hours: number;
  reasoning: string;
};

function reqBodytoRoleRequest(body: Object): RoleRequest {
  return {
    role: body["role"],
    user: body["user"],
    project: toProject(body["project"]),
    hours: body["hours"],
    reasoning: body["reasoning"],
  };
}

app.post("/grantRole", validateUser, bodyParser.json(), async (req, res) => {
  const roleReq = reqBodytoRoleRequest(req.body);

  if (roleReq.user != req["user"].email) {
    return res
      .status(401)
      .send("You do not have permissions to elevate this user");
  }

  await grantRole(
    roleReq.user,
    roleReq.project,
    roleReq.role,
    roleReq.hours,
    roleReq.reasoning
  );

  return res.status(200).json(req.body);
});

declare var __dirname;

app.use(express.static(__dirname + "/../../breakglass-ui/dist"));

console.log("Running app on 8080");

app.listen(8080);
