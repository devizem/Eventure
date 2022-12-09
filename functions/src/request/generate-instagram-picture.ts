import { https, logger, Response } from 'firebase-functions';
import { EventService } from '../shared/data';
import * as puppeteer from 'puppeteer';
import * as hbs from 'handlebars';
import * as fs from 'fs-extra';
import * as path from 'path';

import imageToBase64 = require('image-to-base64');

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

  function selectRandomFile(path: string) {
    const fileList: string[] = fs.readdirSync(path);
    const fileListLength = fileList.length;
    const randomNumber = Math.floor(Math.random() * fileListLength - 1);
    return fileList[randomNumber];
  }

  try {
    logger.info('Hello logs!', { structuredData: true });
    (async () => {
      try {
        const eventId: string | undefined = req.query.id?.toString();
        if (eventId == undefined) {
          throw new Error('eventId is missing!');
        }

        const documentSnapshot = await EventService.getById(eventId);
        const data = documentSnapshot.data();
        console.log('Retrieved data');

        // launch a new chrome instance
        const browser = await puppeteer.launch({
          headless: true,
        });

        // create a new page
        const page = await browser.newPage();

        // convert all images to code base64
        const eventPicture = await convertToBase64(data?.image[0].downloadURL); // WARNING!! Data should never be undefined

        const mapImagePath = path.join(
          __dirname,
          '../../assets/images/map/portugal/porto.png'
        );
        const mapImage = await convertToBase64(mapImagePath);

        const linePath = '../../assets/images/background/line/';
        const lineImagePath = path.join(
          __dirname,
          `${linePath}${selectRandomFile(path.join(__dirname, linePath))}`
        );
        const lineImage = await convertToBase64(lineImagePath);

        const blocksPath = '../../assets/images/background/blocks/';
        const blocksImagePath = path.join(
          __dirname,
          `${blocksPath}${selectRandomFile(path.join(__dirname, blocksPath))}`
        );
        const blocksImage = await convertToBase64(blocksImagePath);

        // set your html as the pages content
        const html = await compileTpl({
          name: data?.name,
          image: `data:image/png; base64,${eventPicture}`,
          map: `data:image/png; base64,${mapImage}`,
          line: `data:image/png; base64,${lineImage}`,
          blocks: `data: image/png; base64,${blocksImage}`,
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
        const imageResult = await page.screenshot();
        await browser.close();

        resp.writeHead(200, {
          'Content-Type': 'image/png',
          'content-disposition': 'attatchment',
        });
        resp.write(imageResult.toString('binary'), 'binary');
        resp.end();
      } catch (error) {
        console.log(error);
      } finally {
        () => process.exit(0);
      }
      return 0;
    })();
    // return 'das'
  } catch (error) {
    throw new https.HttpsError('internal', "Can't create Instagram post");
  }
}
