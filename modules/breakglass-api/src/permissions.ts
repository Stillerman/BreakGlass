// @ts-ignore
import conf from "../conf.yaml";

function lowerCaseNoDots(user: string): string {
  return user.toLowerCase().replace(/\./g, "");
}

export function canUserParticipate(user: string, project: string): boolean {
  let globallyBlacklisted = (conf.global.blacklist || [])
    .map(lowerCaseNoDots)
    .includes(lowerCaseNoDots(user));
  let globallyWhitelisted = (conf.global.whitelist || [])
    .map(lowerCaseNoDots)
    .includes(lowerCaseNoDots(user));

  let projectBlacklisted = false,
    projectWhitelisted = false;
  // If there is project-wide settings
  if (conf[project]) {
    projectBlacklisted = (conf[project].blacklist || [])
      .map(lowerCaseNoDots)
      .includes(lowerCaseNoDots(user));
    projectWhitelisted = (conf[project].whitelist || [])
      .map(lowerCaseNoDots)
      .includes(lowerCaseNoDots(user));
  }

  if (projectBlacklisted || projectWhitelisted) {
    return projectWhitelisted && !projectBlacklisted;
  } else {
    return globallyWhitelisted && !globallyBlacklisted;
  }
}
