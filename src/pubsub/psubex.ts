import { PubSub } from '@google-cloud/pubsub';
import { OAuth2Client } from '../authClient';
import { google } from 'googleapis';
import updateHistory from 'db/updateHistory';
// import sendEmail from '../mail/sendGrid';

import sendEmail from '../mail/sendGrid';
import base64 from 'base-64';
import { listLabels } from 'generateCredentials';
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const subscriptionName = process.env.SUBSCRIPTION_NAME;
const timeout = 60;
// Imports the Google Cloud client library

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

const participants = [
  'ealqahta@uncc.edu',
  'Lbenne41@uncc.edu',
  'georgeshawjr@gmail.com',
  'achakra7@uncc.edu',
  'jamesdimah737@gmail.com',
  'kcarro27@uncc.edu',
  'davesamuel400@gmail.com',
  'roblurke@gmail.com',
  'fhadavan@uncc.edu',
  'rarguel1@uncc.edu',
  'kklotz@uncc.edu',
  'Doviemaganfei72@gmail.com',
  'ws6643550@gmail.com',
  'mikespencer953@gmail.com',
  'shalletkemunto@gmail.com',
  'frankfurtbenson@gmail.com',
  'annemmaculate60@gmail.com',
  'amosboks@gmail.com',
  'wvirgin087@gmail.com',
  'kennethroland321@gmail.com',
  'selinaroberts904@gmail.com',
  'danielphilips1779@gmail.com',
  'maneabraham91@gmail.com',
  'kiragumeru001@gmail.com',
  'apate234@uncc.edu',
  'htulasi@uncc.edu',
  'mzimnoch@uncc.edu',
];
  export async function listenForMessages(oAuth2Client: OAuth2Client) {
  console.log('start listenting');
  await listLabels(oAuth2Client);
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionName as string);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = async (message: { id: any; data: any; attributes: any; ack: () => void }) => {
    // setTimeout(() => {
    //   message.ack();
    //   console.log('message ack');
    // }, 200);
    // return;
    const fMessage = message.data ? Buffer.from(message.data, 'base64').toString() : 'no Data provided';
    const msgObj = JSON.parse(fMessage);
    console.log(`Received message ${message.id}:`);
    // console.log(`\tData: ${message.data}`);
    // console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;
    console.log('new history', msgObj.historyId);
    const prevHistoryid = await updateHistory(msgObj.historyId);
    console.log('OLD HISTORY', prevHistoryid);
    if (prevHistoryid) {
      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      // Object.entries(message.data).map(([key, value]) => console.log(key, value));

      const his = await gmail.users.history
        .list({
          startHistoryId: prevHistoryid,
          userId: 'me',
          historyTypes: ['messageAdded', 'labelAdded'],
          labelId: 'UNREAD',
        })
        .catch((err: { message: any }) => {
          console.log(err.message);
        });
      if (his && his.data.history) {
        for (const item of his.data.history) {
          const messagesAdded = item.messagesAdded;

          if (messagesAdded) {
            console.log('messages added');
            const messageIDs: string[] = [];
            for (const item of messagesAdded) {
              const message = item.message;
              if (!message || !message.id) {
                continue;
              }
              const ID = messageIDs.find((id) => id === message.id);
              if (!ID) {
                messageIDs.push(message.id);
              }
            }
            console.log('printing', messageIDs);
            for (const ID of messageIDs) {
              await gmail.users.messages
                .modify({
                  id: ID,
                  userId: 'me',
                  requestBody: {
                    removeLabelIds: ['UNREAD'],
                  },
                })
                .catch((err) => {
                  console.log(err);
                });

              const email = await gmail.users.messages.get({ id: ID, userId: 'me' }).catch((err) => {
                console.log(err);
              });
              if (!email) continue;
              // console.log(JSON.stringify(email?.data?.payload?.parts, null, 4));

              const subject = email.data.payload?.headers?.find((header) => header.name === 'Subject');
              const sender = email.data.payload?.headers?.find((header) => header.name === 'From');
              const body = email.data.payload?.parts && email?.data?.payload?.parts[0]?.body?.data;
              let htmlBody;
              let isUsingVirtru = false;
              try {
                //if succeeds then user is not using virtru
                htmlBody = base64.decode(body as string);
                console.log(htmlBody);
              } catch {
                isUsingVirtru = true;
              }
              console.log(subject, sender, htmlBody);
              if (!sender) return;
              const senderEmail = extractEmails(sender);
              console.log(senderEmail);
              if (!participants.includes(senderEmail[0] as string)) return;
              if (htmlBody) {
                //email for  non virtu users
                await sendEmail({
                  to: senderEmail[0],
                  from: 'human.resources4employee@gmail.com',
                  subject: 'Follow-up study_vitru not detected',
                  text: 'Hi, Please fill out the follow-up survey,https://forms.gle/xQ1vUCK3G1ftfCGT7',
                  html: 'https://forms.gle/xQ1vUCK3G1ftfCGT7',
                });
              } else if (isUsingVirtru) {
                //email for virtru virtru users
                await sendEmail({
                  to: senderEmail[0],
                  from: 'human.resources4employee@gmail.com',
                  subject: 'Follow-up study_vitru detected',
                  text: 'Hi, Please fill out the follow-up survey,https://forms.gle/iu8WP9MSrZoLmN2F9',
                  html: 'https://forms.gle/iu8WP9MSrZoLmN2F9',
                });
              }
            }
          }
        }
      }
    }

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  // setTimeout(() => {
  //   subscription.removeListener('message', messageHandler);
  console.log(`${messageCount} message(s) received.`);
  // }, timeout * 1000);
}

// const hasVirtru = (body: any) => {
//   const virtruRegex = /.* (Virtru)/;
//   const match = body.match(virtruRegex);
//   console.log(body)
// console.log(match)
//   if (match && match[1]) {
//     return true;
//   }
//   return false;
// };

function extractEmails(text: any) {
  return text.value.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
}