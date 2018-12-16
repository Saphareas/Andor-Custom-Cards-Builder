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

function generateCards({story_cards, event_cards}) {
  if (story_cards == undefined || event_cards == undefined) {
    console.debug("Bad JSON contents. At least 'story_cards' and 'event_cards' objects are needed.");
    process.exit(1);
  }

  fs.readFile("story-template.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      console.debug("Something went wrong.");
      process.exit(1);
    }
    const story_template = data;
    for (i=0; i<story_cards.length; i++) {
      let story_card = story_template
        .replace("{{title}}", "Lorem ipsum dolor")
        .replace("{{index}}", story_cards[i].index)
        .replace("{{story}}", story_cards[i].story_text)
        .replace("{{gameplay}}", story_cards[i].gameplay_text);
      //story_card.window.document.getElementById("card-index").innerText = story_cards[i].index;
      //console.log(story_card);
      (async (card, index) => {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.setViewport({width: 2006, height: 1530});
        await page.setContent(card);
        await page.screenshot({path: `out/card-${index}.png`});

        await browser.close();
      })(story_card, story_cards[i].index);
    }
  });

  //console.log(event_cards);
}

function echoHelp() {
  let helpString = `//TODO: help string`;
  console.log(helpString);
}
