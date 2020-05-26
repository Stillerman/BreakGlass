import express from "express";
import bodyParser from "body-parser";
import { validateUser } from "./auth";
import { canUserParticipate } from "./permissions";

import { getConf } from "./getConf";

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
  if (getConf()?.global?.permissions) {
    permissions = [...permissions, ...getConf().global.permissions];
  }
  if (
    getConf()[req.params.project] &&
    getConf()[req.params.project].permissions
  ) {
    permissions = [
      ...permissions,
      ...getConf()[req.params.project].permissions,
    ];
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

router.get("/oauthClientId", (req, res) => {
  res.json(getConf().OAuthClientId);
});

export default router;
