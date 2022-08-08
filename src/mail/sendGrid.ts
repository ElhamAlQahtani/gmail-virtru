import sgMail from '@sendgrid/mail';

sgMail.setApiKey('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');

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
