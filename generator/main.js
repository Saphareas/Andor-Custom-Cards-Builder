/**
 * Copyright (C) 2018 Fabian Große
 * This software is licensed under the GNU General Public License 3 (GPLv3) or later.
 * For details please see the LICENSE file that should be included with this software.
 */

const fs = require("fs");
const puppeteer = require("puppeteer");
const mergePDFs = require("./lib/mergepdfs.js");

//TODO: Multiple args for story, fog, events, etc
let relevantArg = process.argv[2];

// Check if the argument is valid, either 'help' or path to a .json file
if (relevantArg != null && relevantArg != "undefined") {
	if (relevantArg == "help") {
		echoHelp();
	} else { // Try to read the file and continue on success.
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

/**
 * Build Andor cards from a JSON object
 * @param {object} jsonObj
 */
function generateCards(jsonObj) {
	// Build story cards
	if (jsonObj.story_cards == undefined) {
		console.debug("Nothing to do for story cards...");
	} else {
		console.log("Building your story cards...");
		buildStoryCards(jsonObj.title, jsonObj.story_cards);
	}
}

/**
 * Build Andor story cards and output as ready-to-print PDF files
 * @param {string} title        Title of your campaign
 * @param {object} story_cards  Object conaining card declarations
 */
async function buildStoryCards(title, story_cards) {
	await (async () => {
		for (i = 0; i < story_cards.length; i++) {
			let params = [];
			params.push("title="+title);
			params.push("index_1="+story_cards[i].index);
			params.push("content_1="+story_cards[i].content);
			if (story_cards[i].background) {
				params.push("background_1="+story_cards[i].background);
			} else {
				// assets/Andor_Blankocard-1.png
				params.push("background_1=assets/Andor_Blankocard-1.png");
			}
			i++;
			if (i < story_cards.length) {
				params.push("index_2="+story_cards[i].index);
				params.push("content_2="+story_cards[i].content);
				if (story_cards[i].background) {
					params.push("background_2="+story_cards[i].background);
				} else {
					params.push("background_2=assets/Andor_Blankocard-1.png");
				}
			}
			(async (params, index) => {
				const browser = await puppeteer.launch({headless: true});
				const page = await browser.newPage();
				await page.goto("file:///"
					+ process.cwd()
					+ "/story-template.html?"
					+ encodeURI((params.join("&"))));
				await page.pdf({path: `out/card-${index}.pdf`, format: "A4", printBackground: true});
				await browser.close();
			})(params, `${i-1}-${i}`);
		}
	})();
	console.log("Merging PDF files...");
	await mergePDFs.merge(process.cwd() + "/out");
}

function echoHelp() {
	let helpString = `//TODO: help string`;
	console.log(helpString);
}
