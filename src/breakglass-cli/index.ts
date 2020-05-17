import {
  toProject,
  getProjects,
  getPolicy,
  updatePolicy,
  cleanEnv,
  grantRole,
} from "../breakglass-core/escalate";
import inquirer from "inquirer";

async function escalate() {
  const allProjects = await getProjects();
  const answers = await inquirer.prompt([
    {
      message: "Which project would you like to escalate Bobs on privileges?",
      type: "list",
      choices: allProjects.map((p) => p.id),
      name: "pid",
    },
    {
      message: "Select Role",
      type: "list",
      choices: ["roles/editor", "roles/iam.securityReviewer"],
      name: "role",
    },
    {
      message: "How many hours would you like to have this role",
      type: "number",
      name: "hours",
    },
  ]);

  let selectedProject = toProject(answers["pid"]);
  let selectedRole = answers["role"];
  let hours = answers["hours"];

  await grantRole(
    "Bob@jasonstillerman.com",
    selectedProject,
    selectedRole,
    hours
  );

  console.log("Credentials updated!");

  await cleanEnv();
}

escalate();
