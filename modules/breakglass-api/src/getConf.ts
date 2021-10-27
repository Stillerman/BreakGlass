import YAML from "yaml";

export function getConf() {
  //@ts-ignore
  const rawConf = process.env.config;

  if (rawConf) {
    const parsedConfig = YAML.parse(rawConf);
    parsedConfig["ServiceAccountKey"] = JSON.parse(process.env.GCP_CREDENTIALS);
    parsedConfig["OAuthClientId"] = process.env.OAUTH_CLIENT_ID;
    parsedConfig["SendGridKey"] = process.env.SENDGRID_KEY;
    return parsedConfig;
  } else {
    throw new Error("NO CONFIG PROVIDED IN ENV");
  }
}
