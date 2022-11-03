/**
 * Generate instagram picture of Events[eventId]
 * 
 *   Generate serviceAccountKey to allow admin access to firebase
  >>Firebase Console > Project Overview > Project Settings > Service Accounts
  Choose Firebase Admin SDK then Create service account and finally Generate new private key.
  (Download it and use locally only, do not share or commit it)
  Save it on scripts/credentials

 * 
 * Set the environment variable GOOGLE_APPLICATION_CREDENTIALS to the file path of the JSON file that contains your service account key.
 * $ export GOOGLE_APPLICATION_CREDENTIALS="..."
 * $ node ./scripts/generate-instagram-picture.js NSQJRipCSvxbhpPEc6lM
 */

const admin = require('../functions/node_modules/firebase-admin');
const app = admin.initializeApp();

const { EventService } = require('../functions/lib/shared/data');

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');

const args = process.argv.slice(2);

async function compileTpl(data) {
  try {
    const filePath = path.join(
      __dirname,
      '../functions/assets/templates/instagram-picture.hbs'
    );
    const tpl = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(tpl)(data);
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  try {
    const eventId = args?.[0] ?? undefined;
    if (!eventId) {
      throw 'An event id is required as argument';
    }
    console.log(eventId);

    const documentSnapshot = await EventService.getById(eventId);
    let data = documentSnapshot.data();
    console.log(`Retrieved data: ${JSON.stringify(data)}`);


    // launch a new chrome instance
    const browser = await puppeteer.launch({
      headless: true,
    });

    // create a new page
    const page = await browser.newPage();

    // set your html as the pages content
    const html = await compileTpl({ name: data.name, city: data.city });
    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
    });

    await page.setViewport({
      width: 960,
      height: 760,
      deviceScaleFactor: 1,
    });

    // const imageBuffer = await page.screenshot({});
    await page.screenshot({ path: 'result.png', fullPage: true });

    await browser.close();
  } catch (error) {
    console.log(error);
  } finally {
    () => process.exit(0);
  }
})();
