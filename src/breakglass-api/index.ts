import express from "express";
import cors from "cors";

import {
  getProjects,
  grantRole,
  Project,
  toProject,
} from "../breakglass-core/escalate";
import bodyParser from "body-parser";

const app = express();

app.use(cors());

app.get("/getProjects", async (req, res) => {
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

app.post("/grantRole", bodyParser.json(), async (req, res) => {
  const roleReq = reqBodytoRoleRequest(req.body);

  await grantRole(
    roleReq.user,
    roleReq.project,
    roleReq.role,
    roleReq.hours,
    roleReq.reasoning
  );

  return res.status(200).json(req.body);
});

app.listen(8080);
