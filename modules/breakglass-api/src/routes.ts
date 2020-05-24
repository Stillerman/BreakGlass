import express from "express";
import bodyParser from "body-parser";
import { validateUser } from "./auth";
import { canUserParticipate } from "./permissions";

//@ts-ignore
import conf from "../conf.yaml";

import { getProjects, grantRole, toProject } from "../../breakglass-core";

import { reqBodytoRoleRequest } from "./roleReq";
import { notify } from "./notify";

let router = express.Router();

router.get("/getProjects", validateUser, async (req, res) => {
  let projects = await getProjects();
  return res.json(
    projects.filter((proj) => canUserParticipate(req["user"].email, proj.id))
  );
});

router.get("/getRoles/:project", validateUser, async (req, res) => {
  console.log("Getting permissions for", req.params.project);
  let permissions = [];
  if (conf?.global?.permissions) {
    permissions = [...permissions, ...conf.global.permissions];
  }
  if (conf[req.params.project] && conf[req.params.project].permissions) {
    permissions = [...permissions, ...conf[req.params.project].permissions];
  }
  res.json(permissions);
});

router.post("/grantRole", validateUser, bodyParser.json(), async (req, res) => {
  const roleReq = reqBodytoRoleRequest(req.body);
  console.log("Granting Role!", roleReq.role);

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

  console.log("Successful!");

  await notify(roleReq);

  return res.status(200).json(req.body);
});

export default router;
