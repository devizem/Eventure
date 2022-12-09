import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

import { generateInstagramPicture as generateInstagramPictureAlias } from './request/generate-instagram-picture';

export const cgenerateInstagramPicture = functions.https.onRequest(
  generateInstagramPictureAlias
);
