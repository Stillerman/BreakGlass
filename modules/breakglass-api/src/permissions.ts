import { getConf } from "./getConf";

function lowerCaseNoDots(user: string): string {
  return user.toLowerCase().replace(/\./g, "");
}

export function canUserParticipate(user: string, project: string): boolean {
  let globallyBlacklisted = (getConf().global.blacklist || [])
    .map(lowerCaseNoDots)
    .includes(lowerCaseNoDots(user));
  let globallyWhitelisted = (getConf().global.whitelist || [])
    .map(lowerCaseNoDots)
    .includes(lowerCaseNoDots(user));

  let projectBlacklisted = false,
    projectWhitelisted = false;
  // If there is project-wide settings
  if (getConf()[project]) {
    projectBlacklisted = (getConf()[project].blacklist || [])
      .map(lowerCaseNoDots)
      .includes(lowerCaseNoDots(user));
    projectWhitelisted = (getConf()[project].whitelist || [])
      .map(lowerCaseNoDots)
      .includes(lowerCaseNoDots(user));
  }

  if (projectBlacklisted || projectWhitelisted) {
    return projectWhitelisted && !projectBlacklisted;
  } else {
    return globallyWhitelisted && !globallyBlacklisted;
  }
}
