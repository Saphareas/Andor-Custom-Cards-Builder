/**
 * Copyright (C) 2019 Fabian Große
 * This software is licensed under the GNU General Public License 3 (GPLv3) or later.
 * For details please see the LICENSE file that should be included with this software.
 */

const fs = require("fs");
const puppeteer = require("puppeteer");
const mergePDFs = require("./lib/mergepdfs.js");

/**
 * Main function
 */
function main() {
  /**
   * Tries to read the file in 'arg', tries to parse it as JSON and then passes the JSON object to the 'callback'.
   * @param {String} arg         Path to JSON file
   * @param {Function} callback  Function to execute on the file
   */
  function _readFile(arg, callback) {
    if (arg != undefined) {
      fs.readFile(arg, (err, data) => {
        if (err) {
          console.error(err);
          console.log("Argument is not a valid path or file doesn't exist. Use 'help' for usage information.");
          return;
        }
        try {
          let jsonObj = JSON.parse(data);
          callback(jsonObj);
        } catch (ex) {
          console.error(`Something went wrong while parsing ${arg} into JSON!`);
          console.error(ex);
        }
      });
    }
  }

  const args = parseArguments(process.argv.slice(2));
  console.log("Starting...");
  if (!fs.existsSync(args.outDir)) {
    fs.mkdirSync(args.outDir);
  }
  // Build story cards
  _readFile(args.story, function(jsonObj) {
    console.log("Building your story cards...");
    buildStoryCards(jsonObj.title, jsonObj.story_cards, args.outDir);
  });
  // Build fog tiles
  _readFile(args.fog, function(jsonObj) {
    console.log("Building your fog tiles...");
    buildFogTiles(jsonObj, args.outDir);
  });
  // Build event cards
  _readFile(args.events, function(jsonObj) {
    console.log("Building your event cards...");
    buildEventCards(jsonObj, args.outDir);
  });
}

/**
 * Get launch arguments (prefixed with '--')
 * @param {String Array} args
 * @returns {object} Collection of arguments
 */
function parseArguments(args) {
  const cwd = process.cwd();
  //console.debug(args);
  if (args[0] == "-h" || args[0] == "--help" || args == 0) { // [] == [] => false, but [] == 0 => true WTF?
    echoHelp();
    process.exit();
  }

  let outDir = args.find((el) => {return el.includes("--out-dir=")});
  if (outDir != undefined)
    outDir = outDir.split('=')[1];
  else
    outDir = "./out";

  let storyArg = args.find((el) => {return el.includes("--story=")});
  if (storyArg != undefined)
    storyArg = storyArg.split('=')[1];

  let fogArg = args.find((el) => {return el.includes("--fog=")});
  if (fogArg != undefined)
    fogArg = fogArg.split('=')[1];

  let eventsArg = args.find((el) => {return el.includes("--events=")});
  if (eventsArg != undefined)
    eventsArg = eventsArg.split('=')[1];

  return {
    outDir: outDir,
    story: storyArg,
    fog: fogArg,
    events: eventsArg
  };
}

/**
 * Build Andor story cards and save as ready-to-print PDF files.
 * @param {string} title        Title of your campaign.
 * @param {object} story_cards  Object containing card declarations.
 * @param {string} outDir       Target directory for the generated files.
 */
async function buildStoryCards(title, story_cards, outDir) {
  for (i = 0; i < story_cards.length; i++) {
    let params = [];
    params.push("title=" + title);
    params.push("index_1=" + story_cards[i].index);
    params.push("text_1=" + story_cards[i].text);
    if (story_cards[i].image) {
      params.push("image_1=" + story_cards[i].image);
    } else {
      params.push("image_1=../assets/Andor_Blankocard-1.png");
    }
    i++;
    if (i < story_cards.length) {
      params.push("index_2=" + story_cards[i].index);
      params.push("text_2=" + story_cards[i].text);
      if (story_cards[i].image) {
        params.push("image_2=" + story_cards[i].image);
      } else {
        params.push("image_2=../assets/Andor_Blankocard-1.png");
      }
    }
    await (async (params, index) => {
      const browser = await puppeteer.launch({headless: true});
      const page = await browser.newPage();
      await page.goto("file:///"
        + process.cwd()
        + "/templates/story-template.html?"
        + encodeURI(params.join("&")));
      await page.pdf({path: `${outDir}/story.part${index}.pdf`, format: "A4", printBackground: true});
      await browser.close();
    })(params, `${i}-${i+1}`);
  }
  mergePDFs.merge(outDir, "story.part", "story-merged.pdf", true);
}

/**
 * Build Andor fog tiles and save as ready-to-print PDF files.
 * @param {object} jsonObj  Object containing an array of fog declarations.
 * @param {string} outDir   Target directory for the generated files.
 */
async function buildFogTiles(jsonObj, outDir) {
  /**
   * Builds one page of fog
   * @param {object} slice    Object containing an array of fog declarations (max. 11 rows).
   * @param {number} counter  Current page Number. Will be added to the file name.
   */
  async function _helper(slice, counter) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto("file:///"
      + process.cwd()
      + "/templates/fog-template.html?json="
      + encodeURI(JSON.stringify(slice)));
    await page.pdf({path: `${outDir}/fog.part${counter}.pdf`, format: "A4"});
    await browser.close();
  }

  jsonObj.fog.forEach(el => {
    if (el.count > 8)
      el.count = 8;
  });

  let fogSlice = {};
  let i = 1;
  while (jsonObj.fog.length > 11) {
    fogSlice = {};
    fogSlice.fog = jsonObj.fog.slice(0, 11);
    await _helper(fogSlice, i++);
    jsonObj.fog = jsonObj.fog.slice(11, jsonObj.fog.length);
  }
  fogSlice.fog = jsonObj.fog;
  await _helper(fogSlice, i++);
  mergePDFs.merge(outDir, "fog.part", "fog-merged.pdf", true);
}

/**
 * Build Andor event cards and save as ready-to-print PDF files.
 * @param {Object} jsonObj  Object containing an array of event card declarations.
 * @param {String} outDir   Target directory for the generated files.
 */
async function buildEventCards(jsonObj, outDir) {
  /**
   * Builds one page of event cards
   * @param {object} slice    Object containing an array of event card declarations (max. 8).
   * @param {number} counter  Current page Number. Will be added to the file name.
   */
  async function _helper(slice, counter) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto("file:///"
      + process.cwd()
      + "/templates/events-template.html?cards="
      + encodeURI(JSON.stringify(slice)));
    await page.pdf({path: `${outDir}/events.part${counter}.pdf`, format: "A4", printBackground: true});
    await browser.close();
  }

  let cards = jsonObj.cards;
  let cardsSlice = {};
  let i = 1;
  while (cards.length > 8) {
    cardsSlice = cards.slice(0, 8);
    await _helper(cardsSlice, i);
    cards = cards.slice(8, cards.length);
    i++;
  }
  cardsSlice = cards;
  await _helper(cardsSlice, i++);

  if (jsonObj.printBacks) {
    let backs = [];
    for (j=0; j<8; j++) {
      backs.push({isBack: true});
    }
    await _helper(backs, "backs");
  }
  mergePDFs.merge(outDir, "events.part", "events-merged.pdf", true);
}

/**
 * Logs a help string to the console
 */
function echoHelp() {
  let helpString = `
${require("./package.json").name} ${require("./package.json").version}
${require("./package.json").description}
-h/--help                               Get this help text
--out-dir=</some/folder>                Set the output directory
--story=</path/to/your-story.json>      Set the path for your story.json file
--fog=</path/to/your-fog.json>          Set the path for your story.json file
--events=</path/to/your-events.json>    Set the path for your story.json file
`;
  console.log(helpString);
}

if (require.main === module) {
  // Entry point
  main();
} else {
  // npm exports
  exports.buildStoryCards = buildStoryCards;
  exports.buildFogTiles = buildFogTiles;
  exports.buildEventCards = buildEventCards;
}
