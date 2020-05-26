import YAML from "yaml";

export function getConf() {
  //@ts-ignore
  const rawConf = process.env.config;
  if (rawConf) {
    return YAML.parse(rawConf);
  } else {
    throw new Error("NO CONFIG PROVIDED IN ENV");
  }
}
