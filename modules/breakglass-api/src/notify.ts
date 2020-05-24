import { RoleRequest } from "./roleReq";
import sgMail from "@sendgrid/mail";

//@ts-ignore
import conf from "../conf.yaml";

export async function notify(roleReq: RoleRequest) {
  console.log("NOTIFYING THE AUTHORITIES!", conf.SendGridKey);

  let recipients = [];

  if (conf?.global?.notify?.emails?.length > 0) {
    recipients = [...recipients, ...conf.global.notify.emails];
  }

  if (conf[roleReq.project.id]?.notify?.emails?.length > 0) {
    recipients = [...recipients, ...conf[roleReq.project.id].notify.emails];
  }

  sgMail.setApiKey(conf.SendGridKey);
  const msg = {
    from: "jason.t.stillerman@gmail.com",
    to: recipients,
    subject: roleReq.user + " Broke the Glass",
    text: `${roleReq.user} just broke the glass on project ${roleReq.project.id}. They assumed the role ${roleReq.role} for ${roleReq.hours} hours. This was the reasoning they provided: "${roleReq.reasoning}"`,
  };
  try {
    await sgMail.sendMultiple(msg);
  } catch (e) {
    console.log("There was an error", e.message);
  }
  return;
}
