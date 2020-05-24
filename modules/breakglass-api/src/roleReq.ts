import { toProject, Project } from "../../breakglass-core";

export type RoleRequest = {
  role: string;
  project: Project;
  user: string;
  hours: number;
  reasoning: string;
};

export function reqBodytoRoleRequest(body: Object): RoleRequest {
  return {
    role: body["role"],
    user: body["user"],
    project: toProject(body["project"]),
    hours: body["hours"],
    reasoning: body["reasoning"],
  };
}
