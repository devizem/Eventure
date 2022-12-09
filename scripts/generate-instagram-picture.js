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
admin.initializeApp();

const { EventService } = require('../functions/lib/shared/data');

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const imageToBase64 = require('image-to-base64');

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

async function convertToBase64(url) {
  try {
    const imageBase64 = await imageToBase64(url);
    return imageBase64;
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  try {
       
    const eventId = '0LIVlNHIoTtfJNuMBSfM'

    const documentSnapshot = await EventService.getById(eventId);
    let data = documentSnapshot.data();
    // console.log(`Retrieved data: ${JSON.stringify(data)}`);
    console.log(`Retrieved data`);

    // launch a new chrome instance
    const browser = await puppeteer.launch({
      headless: true,
    });

    // create a new page
    const page = await browser.newPage();

    // convert image to code base64
    const image = await convertToBase64(data.image[0].downloadURL);
    
    // set your html as the pages content
    const html = await compileTpl({ name: data?.name, image: `data:image/png;base64,${image}`});
    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
    });

    // add file with paths
    const styleFilePath = path.join(
      __dirname, 
      '../functions/assets/styles/main.css'
      );
    await page.addStyleTag({path: styleFilePath});

    // set the viewport to instagram post size
    await page.setViewport({
      width: 1080,
      height: 1080,
      deviceScaleFactor: 1,
    });

    console.log(html);

    await page.screenshot({ path: 'result.png' });

    await browser.close();
  } catch (error) {
    console.log(error);
  } finally {
    () => process.exit(0);
  }
})();
