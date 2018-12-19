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
    console.debug("Nothing to do for story cards...");
  } else {
    console.log("Building your story cards...");
    buildStoryCards(jsonObj.title, jsonObj.story_cards);
  }
}

function buildStoryCards(story_cards) {
function buildStoryCards(title, story_cards) {
  fs.readFile("story-template.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      console.debug("Something went wrong.");
      process.exit(1);
    }
    const story_template = data;

    for (i = 0; i < story_cards.length; i+=2) {
      let j = i;
      let card = story_template
        .replace("{{ title }}", title)
        .replace("{{ index_1 }}", story_cards[j].index)
        .replace("{{ content_1 }}", story_cards[j].content);
      j++; //console.debug(j);
      if (j < story_cards.length) {
        card = card
          .replace("{{ title }}", title)
          .replace("{{ index_2 }}", story_cards[j].index)
          .replace("{{ content_2 }}", story_cards[j].content);
      } else {
        card = card
          .replace("{{ title }}", "")
          .replace("{{ index_2 }}", "")
          .replace("{{ content_2 }}", "");
      }
      (async (card, index) => {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.setContent(card);
        await page.pdf({path: `out/card-${index}.pdf`, format: "A4", printBackground: true});
        await browser.close();
      })(card, `${--j}-${++j}`);
    }
  });
}

function echoHelp() {
  let helpString = `//TODO: help string`;
  console.log(helpString);
}
