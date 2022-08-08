import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface EmailMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}
export default async (email: EmailMessage) => {
  const { to, from, subject, text, html } = email;
  const msg = {
    to,
    from,
    subject,
    text,
    html,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((err) => console.log('email not sent', err));
};
