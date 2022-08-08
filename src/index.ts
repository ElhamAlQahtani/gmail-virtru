import dotenv from 'dotenv';
dotenv.config();

import oAuth2Client from './authClient';
import { listenForMessages } from './pubsub/psubex';
import { generateCredentials } from './generateCredentials';
import rewatch, { watch } from 'cron/watch';
import { google } from 'googleapis';

// SibApiV3Sdk.TransactionalEmailsApi
// uncomment generate create token.json
// copy token.json values into .env file
// generateCredentials();
try {
  listenForMessages(oAuth2Client);
} catch (error) {
  console.log(error);
}
(async () => {
  //run cron job every day once
  console.log('starting cron job');
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  watch(gmail);
  await rewatch(gmail);
})();
