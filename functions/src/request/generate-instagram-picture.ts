import { https, logger, Response } from 'firebase-functions';

// import { EventService } from '../shared/data';

/* eslint-disable no-alert, @typescript-eslint/no-explicit-any */
export async function generateInstagramPicture(
  req: https.Request,
  resp: Response<any>
) {
  try {
    logger.info('Hello logs!', { structuredData: true });
    resp.send('Hello from Firebase!');
  } catch (error) {
    throw new https.HttpsError('internal', "Can't create Twitter post");
  }
}
