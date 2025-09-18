import { Resend } from "resend";

const resend = new Resend("re_JupRUwXA_83FXfwrZZ7giM25qK2DudN8b");

resend.emails.send({
  from: "onboarding@resend.dev",
  to: "pandayhariom2898@gmail.com",
  subject: "Hello World",
  html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
});
