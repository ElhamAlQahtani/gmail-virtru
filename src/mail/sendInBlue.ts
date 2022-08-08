// eslint-disable-next-line @typescript-eslint/no-var-requires
const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';
const api = new SibApiV3Sdk.TransactionalEmailsApi();

interface EmailMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}
export default async (email: EmailMessage) => {
  console.log('sending email', email)
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
  sendSmtpEmail.subject = email.subject;
  sendSmtpEmail.htmlContent = email.html;
  sendSmtpEmail.textContent = email.text;
  sendSmtpEmail.sender = { email: email.from };
  sendSmtpEmail.to = [{ email: email.to }];
  await api.sendTransacEmail(sendSmtpEmail).catch((err: any) => console.log(err));
};
