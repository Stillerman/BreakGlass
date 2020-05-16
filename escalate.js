const { exec } = require("child_process");
const inquirer = require("inquirer");
const fs = require("fs");

const FILENAME = "policy.json";

async function cmd(command) {
  return new Promise((acc, rej) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return rej(err);
      if (stderr) return rej(stderr);
      acc(stdout);
    });
  });
}

async function escalate() {
  const projectsStr = await cmd("gcloud projects list");
  const projectIds = projectsStr
    .split("\n")
    .splice(1)
    .filter((s) => s.length != 0)
    .map((line) => line.split(" ")[0]);

  const chosenProject = (
    await inquirer.prompt([
      {
        message: "Which project would you like to escalate Bobs privileges?",
        type: "list",
        choices: projectIds,
        name: "pid",
      },
    ])
  ).pid;

  console.log("Chose project", chosenProject);

  let currentIam = JSON.parse(
    await cmd(`gcloud projects get-iam-policy ${chosenProject} --format=json`)
  );

  let selectedRole = (
    await inquirer.prompt([
      {
        message: "Select Role",
        type: "list",
        choices: ["roles/editor", "roles/iam.securityReviewer"],
        name: "role",
      },
    ])
  ).role;

  currentIam.bindings.push(getTempBinding(selectedRole));

  fs.writeFileSync(FILENAME, JSON.stringify(currentIam));

  try {
    await cmd(`gcloud projects set-iam-policy ${chosenProject} ${FILENAME}`);
  } catch (e) {
    console.log(e.message);
  }

  console.log("Credentials updated!");

  await cmd("rm " + FILENAME);
}

function getTempBinding(role) {
  let d = new Date();
  addHours(d, 8);

  let dateStr = d.toISOString();

  return {
    members: ["user:Bob@jasonstillerman.com"],
    role: role,
    condition: {
      title: "Expires_In_8",
      description: "Expires in 8 hours",
      expression: `request.time < timestamp('${dateStr}')`,
    },
  };
}

function addHours(date, hours) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
}

escalate();
