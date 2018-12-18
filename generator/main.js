/**
 * Copyright (C) 2018 Fabian Große
 * This software is licensed under the GNU General Public License 3 (GPLv3) or later.
 * For details please see the LICENSE file that should be included with this software.
 */

const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const puppeteer = require('puppeteer');

let relevantArg = process.argv[2];
//console.debug(relevantArg);

if (relevantArg != null && relevantArg != "undefined") {
  if (relevantArg == "help") {
    echoHelp();
  } else {
    fs.readFile(relevantArg, (err, data) => {
      if (err) {
        console.error(err);
        console.debug("Argument is not a valid path or file doesn't exist. Use 'help' for usage information.");
        process.exit(1);
      }
      let jsonObj = JSON.parse(data);
      generateCards(jsonObj);
    })
  }
} else {
  console.debug(" No Argument was given. Use 'help' for usage information.");
}

function generateCards(jsonObj) {
  if (jsonObj.story_cards == undefined) {
    console.debug("Nothing to do for Story Cards...");
  } else {
    console.debug(jsonObj.story_cards);
    buildStoryCards(jsonObj.story_cards);
  }
}

function buildStoryCards(story_cards) {
  fs.readFile("story-template.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      console.debug("Something went wrong.");
      process.exit(1);
    }
    const story_template = data;
    for (i=0; i<story_cards.length; i++) {
      let card = story_template
        .replace("{{title}}", "Lorem ipsum dolor")
        .replace("{{index}}", story_cards[i].index)
        .replace("{{content}}", story_cards[i].content);
      (async (card, index) => {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.setViewport({width: 620, height: 475});
        await page.setContent(card);
        await page.screenshot({path: `out/card-${index}.png`});

        await browser.close();
      })(card, story_cards[i].index);
    }
  });
}

function echoHelp() {
  let helpString = `//TODO: help string`;
  console.log(helpString);
}
