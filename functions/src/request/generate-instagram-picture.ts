import { https, logger, Response } from 'firebase-functions';
import { EventService } from '../shared/data';
import * as puppeteer from 'puppeteer';
import * as hbs from 'handlebars';
import * as fs from 'fs-extra';
import * as path from 'path';

import imageToBase64 = require('image-to-base64');

/* type Test = {
  id: string;
  name: string;
} */

/* eslint-disable no-alert, @typescript-eslint/no-explicit-any */
export async function generateInstagramPicture(
  req: https.Request,
  resp: Response<any>
) {
  async function compileTpl(data: any) {
    try {
      const filePath = path.join(
        __dirname,
        '../../assets/templates/instagram-picture.hbs'
      );
      const tpl = await fs.readFile(filePath, 'utf-8');
      return hbs.compile(tpl)(data);
    } catch (error) {
      console.log(error);
      return "Template didn't compile";
    }
  }

  async function convertToBase64(path: string) {
    try {
      const imageBase64 = await imageToBase64(path);
      return imageBase64;
    } catch (error) {
      console.log(error);
      throw new https.HttpsError('internal', 'Conversion error to code base64');
    }
  }

  try {
    logger.info('Hello logs!', { structuredData: true });
    // resp.send('Hello from Firebase!');
    (async () => {
      try {
        const eventId = '0LIVlNHIoTtfJNuMBSfM';

        const documentSnapshot = await EventService.getById(eventId);
        const data = documentSnapshot.data();
        // console.log(`Retrieved data: ${JSON.stringify(data)}`);
        console.log('Retrieved data');

        // launch a new chrome instance
        const browser = await puppeteer.launch({
          headless: true,
        });

        // create a new page
        const page = await browser.newPage();

        // convert image to code base64
        const image = await convertToBase64(data?.image[0].downloadURL);

        // set your html as the pages content
        const html = await compileTpl({
          name: data?.name,
          image: `data:image/png;base64,${image}`,
        });
        await page.setContent(html, {
          waitUntil: 'domcontentloaded',
        });
        const styleFilePath = path.join(
          __dirname,
          '../../assets/styles/main.css'
        );
        await page.addStyleTag({ path: styleFilePath });
        await page.setViewport({
          width: 1080,
          height: 1080,
          deviceScaleFactor: 1,
        });

        // create screenshot of the result in a png format
        await page.screenshot({ path: 'result.png' });

        await browser.close();
      } catch (error) {
        console.log(error);
      } finally {
        () => process.exit(0);
      }
    })();
  } catch (error) {
    throw new https.HttpsError('internal', "Can't create Instagram post");
  }
}
