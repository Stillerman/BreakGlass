import { RoleRequest, getDescription } from "./roleReq";
import sgMail from "@sendgrid/mail";
import axios from "axios";

//@ts-ignore
import conf from "../conf.yaml";

export async function notify(roleReq: RoleRequest) {
  console.log("NOTIFYING THE AUTHORITIES!", conf.SendGridKey);

  conf?.global?.notify?.chatrooms?.forEach((url) => {
    sendWebhook(url, roleReq);
  });

  conf[roleReq.project.id]?.notify?.chatrooms?.forEach((url) => {
    sendWebhook(url, roleReq);
  });

  let recipients = [];

  conf?.global?.notify?.emails?.forEach((email) => recipients.push(email));

  conf[roleReq.project.id]?.notify?.emails?.forEach((email) =>
    recipients.push(email)
  );

  sgMail.setApiKey(conf.SendGridKey);
  const msg = {
    from: "jason.t.stillerman@gmail.com",
    to: recipients,
    subject: roleReq.user + " Broke the Glass",
    text: getDescription(roleReq),
  };
  try {
    await sgMail.sendMultiple(msg);
  } catch (e) {
    console.log("There was an error", e.message);
  }
  return;
}

async function sendWebhook(url: string, roleReq: RoleRequest) {
  axios.post(
    url,
    {
      text: getDescription(roleReq),
    },
    {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    }
  );
}
