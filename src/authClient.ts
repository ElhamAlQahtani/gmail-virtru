import { google } from 'googleapis';

const credentials = {
  web: {
    client_id: process.env.CLIENT_ID,
    project_id: process.env.PROJECT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_URL,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: process.env.REDIRECT_URIS && process.env.REDIRECT_URIS.split(' '),
  },
};

const token = {
  access_token: process.env.ACCESS_TOKEN,
  refresh_token: process.env.REFRESH_TOKEN,
  scope: process.env.SCOPE,
  token_type: 'Bearer',
  expiry_date: parseFloat(process.env.EXPIRY_DATE as string),
};

const { client_secret, client_id, redirect_uris } = credentials.web;
if (!redirect_uris) {
  throw 'redirect uri cannot be blank';
}

const oAuth2Client = new google.auth.OAuth2({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uris[0],
});
// oAuth2Client.projectId = project_id;
oAuth2Client.setCredentials(token);

export default oAuth2Client;

export type OAuth2Client = typeof oAuth2Client;
