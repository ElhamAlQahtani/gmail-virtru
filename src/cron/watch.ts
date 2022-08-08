import { gmail_v1 } from 'googleapis';
import cron from 'node-cron';

export default async (gmail: gmail_v1.Gmail) => {
  cron.schedule('00 00 00 * * *', async () => {
    await watch(gmail);
  });
};

export const watch = async (gmail: gmail_v1.Gmail) => {
  await gmail.users.watch({
    userId: 'me',
    requestBody: {
      labelIds: ['UNREAD'],
      topicName: process.env.TOPIC_NAME,
    },
  });
};
