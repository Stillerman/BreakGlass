import { exec } from "child_process";
import inquirer from "inquirer";
import fs from "fs";

const FILENAME = "policy.json";

async function cmd(command): Promise<string> {
  return new Promise((acc, rej) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return rej(err);
      if (stderr) return rej(stderr);
      acc(stdout);
    });
  });
}

export type Project = {
  id: string;
};

export type Policy = {
  content: Object;
};

export function toProject(str: string): Project {
  return {
    id: str,
  };
}

export function toPolicy(obj: Object): Policy {
  return {
    content: obj,
  };
}

export async function getProjects(): Promise<Array<Project>> {
  const projectsStr = await cmd("gcloud projects list");
  const projectIds = projectsStr
    .split("\n")
    .splice(1)
    .filter((s) => s.length != 0)
    .map((line) => line.split(" ")[0])
    .map(toProject);

  return projectIds;
}

export async function getPolicy(proj: Project): Promise<Policy> {
  let currentIam = toPolicy(
    JSON.parse(
      await cmd(`gcloud projects get-iam-policy ${proj.id} --format=json`)
    )
  );

  return currentIam;
}

export async function updatePolicy(policy: Policy, proj: Project) {
  fs.writeFileSync(FILENAME, JSON.stringify(policy.content));

  try {
    await cmd(`gcloud projects set-iam-policy ${proj.id} ${FILENAME}`);
    return true;
  } catch (e) {
    console.log("[WARN]", e);
    return false;
  }
}

export async function grantRole(
  user: string,
  proj: Project,
  role: string,
  hours: number
) {
  let currentPolicy = await getPolicy(proj);
  currentPolicy.content["bindings"].push(getTempBinding(user, role, hours));
  await updatePolicy(currentPolicy, proj);
}

function getTempBinding(user: string, role: string, hours: number) {
  let d = new Date();
  addHours(d, hours);

  let dateStr = d.toISOString();

  return {
    members: ["user:" + user],
    role: role,
    condition: {
      title: "Expires_In_" + hours.toString(),
      description: `Expires in ${hours} hours`,
      expression: `request.time < timestamp('${dateStr}')`,
    },
  };
}

export async function cleanEnv() {
  await cmd("rm " + FILENAME);
}

function addHours(date: Date, hours: number) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
}
