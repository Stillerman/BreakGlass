import { RoleRequest, getDescription } from "./roleReq";
import sgMail from "@sendgrid/mail";
import axios from "axios";

//@ts-ignore
import { getConf } from "./getConf";

export async function notify(roleReq: RoleRequest) {
  console.log("NOTIFYING THE AUTHORITIES!", getConf().SendGridKey);

  getConf()?.global?.notify?.chatrooms?.forEach((url) => {
    sendWebhook(url, roleReq);
  });

  getConf()[roleReq.project.id]?.notify?.chatrooms?.forEach((url) => {
    sendWebhook(url, roleReq);
  });

  if (getConf().SendGridKey) {
    sendEmails(roleReq);
  }
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

async function sendEmails(roleReq: RoleRequest) {
  let recipients = [];

  getConf()?.global?.notify?.emails?.forEach((email) => recipients.push(email));

  getConf()[roleReq.project.id]?.notify?.emails?.forEach((email) =>
    recipients.push(email)
  );

  sgMail.setApiKey(getConf().SendGridKey);
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
