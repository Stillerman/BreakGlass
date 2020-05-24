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

export function getDescription(roleReq: RoleRequest): string {
  return `${roleReq.user} just broke the glass on project ${roleReq.project.id}.
Role: ${roleReq.role}
Hours: ${roleReq.hours}
Reasoning: "${roleReq.reasoning}"`;
}
